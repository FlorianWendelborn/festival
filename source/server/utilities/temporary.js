// import external

import clarifai from 'clarifai';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import gm from 'gm';
import path from 'path';

// import internal

import {Collection, Item, Temporary} from '../database/models';
import config from '../config';

// prepare

clarifai.initialize({
	clientId: config.clarifai.id,
	clientSecret: config.clarifai.secret
});

// path

export function createPath ({item, type, folder, index, size}) {
	const result = [];
	const name = [];

	switch (folder) {
		case 'permanent':
			result.push(config.storage.permanent);
		break;
		case 'temporary':
			result.push(config.storage.temporary);
		break;
		default:
			throw 'invalid folder';
	}

	name.push(item._id.toString());

	switch (type) {
		case 'thumbnail':
			name.push('-s.jpg');
			// name.push(`-t-${size}.jpg`);
		break;
		case 'screenshot':
			name.push(`-s-${index}.jpg`);
		break;
		case 'video':
			name.push('.mp4');
		break;
		case 'image':
			name.push('.jpg');
		break;
	}

	// add filename

	result.push(name.join(''));

	return path.join.apply(null, result);
}

// plugins

export async function calculateHash ({input, algorithm}) {
	return new Promise((resolve, reject) => {
		const result = crypto.createHash(algorithm);
		const stream = fs.createReadStream(input);
		stream.on('data', data => {
			result.update(data, 'utf8');
		});
		stream.on('end', () => {
			resolve(result.digest('hex'));
		});
	});
}

export async function convertImage ({input, output, width, height, quality}) {
	return new Promise((resolve, reject) => {
		gm(input)
			.autoOrient()
			.trim()
			.resize(width, height, '^')
			.setFormat('jpg')
			.quality(quality)
			.write(output, error => {
				if (error) return reject(['could not convert image']);
				resolve('converted');
			});
	});
}

export async function generateThumbnail ({input, output, size, quality}) {
	return new Promise((resolve, reject) => {
		gm(input)
			.resizeExact(size)
			.setFormat('jpg')
			.quality(quality)
			.write(output, error => {
				if (error) return reject(['could not generate thumbnail', error]);
				resolve('generated');
			});
	});
}

export async function imageRecognition ({url}) {
	return new Promise((resolve, reject) => {
		clarifai.getTagsByUrl(url).then(response => {
			let tags = [];
			response.results.forEach(result => {
				tags = tags.concat(result.result.tag.classes);
			});
			resolve({
				status: 'tagged',
				tags: Array.from(new Set(tags))
			});
		}, error => {
			reject({
				status: 'could not tag image',
				error: error.results[0].result
			});
		});
	});
}

export async function move ({input, output}) {
	return new Promise((resolve, reject) => {
		fs.rename(input, output, error => {
			if (error) return reject(error);
			resolve('moved');
		});
	});
}

export async function sanity (input) {
	return new Promise((resolve, reject) => {
		fs.stat(input, (error) => {
			if (error) return reject(error);
			resolve();
		});
	});
}

// export

let processing = false;

export async function checkTemporary () {
	if (!processing) {
		processing = true;
		const todo = await Temporary.find({});
		if (!todo.length) return processing = false;

		step(todo[0]);
	}
}

async function step (item) {
	console.info(`processing ${item.title} (${item.mimeType}) stage ${item.stage}`);
	if (item.mimeType.startsWith('image/')) {
		try {
			let output;
			switch (item.stage) {
				case 0: // hash
					const hash = await calculateHash({
						input: item.path,
						algorithm: 'sha512'
					});
					item.original.hash = hash;
					advance(item, `hashsum is ${hash}`);
				break;
				case 1: // convert to jpeg
					output = createPath({
						item,
						folder: 'temporary',
						type: 'image'
					});
					await convertImage({
						input: item.path,
						output,
						width: 1920,
						height: 1080,
						quality: 90
					}).then(status => {
						item.path = output;
						advance(item, status);
					});
				break;
				case 2: // generate thumbnail
					output = createPath({
						item,
						folder: 'temporary',
						type: 'thumbnail'
					});
					await generateThumbnail({
						size: 256,
						input: item.path,
						output,
						quality: 90
					}).then(status => {
						item.thumbnailPath = output;
						advance(item, status);
					});
				break;
				case 3: // image Recognition
					await imageRecognition({
						url: `${config.listen.publicUrl}/api/v1.0/temporary/${item._id}.jpg`
					}).then(({status, tags}) => {
						item.tags = tags;
						advance(item, status);
					});
				break;
				case 4: // move
					const finished = new Item({
						title: item.title,
						parent: item.parent,
						description: item.description,
						tags: item.tags,
						fileType: 'image'
					});

					await finished.save();
					await Collection.findOne({
						_id: item.parent
					}).then(parent => {
						parent.items.push(finished._id);
						return parent.save();
					});
					await item.remove();

					// move from temporary to permanent

					await move({
						input: item.path,
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'image'
						})
					});
					await move({
						input: item.thumbnailPath,
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'thumbnail'
						})
					});

					console.info('finished');
					processing = false;
					checkTemporary();
				break;
			}
		} catch (error) {
			destroy(item, 'something went wrong', error);
		}
	} else if (item.mimeType.startsWith('video/')) {
		try {
			let output;
			switch (item.stage) {
				case 0: // screenshot
					await sanity(item.path);
					ffmpeg()
						.input(item.path)
						.screenshot({
							timestamps: ['10%', '30%', '50%', '70%', '90%'],
							filename: `${item._id}-s-%i.jpg`,
							folder: config.storage.temporary
						})
						.on('end', () => {
							item.screenshots = [];
							for (let index = 1; index < 6; index++) {
								item.screenshots.push(createPath({
									item,
									folder: 'temporary',
									type: 'screenshot',
									index
								}));
							}
							advance(item, 'generated screenshots');
						});
				break;
				case 1: // convert to mp4(h264, aac)
					await sanity(item.path);
					output = createPath({
						folder: 'temporary',
						item,
						type: 'video'
					});

					const proc = ffmpeg()
						.input(item.path)
						.output(output)
						.videoCodec('libx264')
						.audioCodec('aac')
						.videoBitrate('1500k')
						// .output(`${newPath}.webm`)
						// .videoCodec('libvpx')
						// .audioCodec('libvorbis')
						// .videoBitrate('1500k')
						// .audioBitrate('160k')
						.on('progress', info => {
							console.info(info);
						})
						.on('end', () => {
							item.path = output;
							advance(item, 'converted');
						})
						.on('error', error => {
							destroy(item, 'could not convert', error);
						}).run();
				break;
				case 2: // thumbnail
					output = createPath({
						item,
						folder: 'temporary',
						type: 'thumbnail'
					});
					await generateThumbnail({
						size: 256,
						input: item.screenshots[2],
						output,
						quality: 90
					}).then(status => {
						item.thumbnailPath = output;
						advance(item, status);
					});
				break;
				case 3: // image recognition on thumbnail
					await imageRecognition({
						url: [
							`${config.listen.publicUrl}/api/v1.0/temporary/${item._id}-s-1.jpg`,
							`${config.listen.publicUrl}/api/v1.0/temporary/${item._id}-s-2.jpg`,
							`${config.listen.publicUrl}/api/v1.0/temporary/${item._id}-s-3.jpg`,
							`${config.listen.publicUrl}/api/v1.0/temporary/${item._id}-s-4.jpg`,
							`${config.listen.publicUrl}/api/v1.0/temporary/${item._id}-s-5.jpg`,
						]
					}).then(({status, tags}) => {
						item.tags = tags;
						advance(item, status);
					});
				break;
				case 4: // finalize
					const finished = new Item({
						title: item.title,
						parent: item.parent,
						description: item.description,
						tags: item.tags,
						fileType: 'video'
					});

					await finished.save();
					await Collection.findOne({
						_id: item.parent
					}).then(parent => {
						parent.items.push(finished._id);
						return parent.save();
					});
					await item.remove();

					// move from temporary to permanent

					await move({
						input: item.path,
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'video'
						})
					});
					await move({
						input: item.thumbnailPath,
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'thumbnail'
						})
					});
					await move({
						input: item.screenshots[0],
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'screenshot',
							index: 0
						})
					});
					await move({
						input: item.screenshots[1],
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'screenshot',
							index: 1
						})
					});
					await move({
						input: item.screenshots[2],
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'screenshot',
							index: 2
						})
					});
					await move({
						input: item.screenshots[3],
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'screenshot',
							index: 3
						})
					});
					await move({
						input: item.screenshots[4],
						output: createPath({
							folder: 'permanent',
							item: finished,
							type: 'screenshot',
							index: 4
						})
					});

					console.info('finished');
					processing = false;
					checkTemporary();
				break;
			}
		} catch (error) {
			destroy(item, 'something went wrong', error);
		}
	} else {
		destroy(item, `item ${item.title} has an invalid mimetype ${item.mimeType}`);
	}
}

function destroy (item, message, error) {
	console.info(message || `destroying item ${item.title}`, error);
	item.remove();
	fs.unlink(item.path, error => {
		if (error) return console.error(error);
		console.info(`deleted ${item.path}`);
	});
}

function advance (item, message) {
	item.stage++;
	console.info(`advanced ${item.title} to stage ${item.stage}${message ? `: ${message}` : ''}`);
	item.save().then(() => {
		processing = false;
		checkTemporary();
	}).catch(error => destroy(item, 'could not save', error));
}

checkTemporary();
