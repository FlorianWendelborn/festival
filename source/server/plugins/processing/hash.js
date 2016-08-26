// import external

import crypto from 'crypto';

// meta

export const info = {
	author: {
		alias: 'dodekeract',
		link: 'https://github.com/dodekeract'
	},
	input: {
		type: ['originalFile', 'screenshot', 'thumbnail', 'image', 'video']
	},
	output: ['hash'],
	options: {
		algorithm: ['sha256', 'sha512']
	}
};

// run

export async function run ({options, input}) {

	const {algorithm} = Object.assign({
		algorithm: 'sha512'
	}, options);

	const {type} = Object.assign({
		type: 'originalFile'
	}, input);

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

// export

export default {info, run};
