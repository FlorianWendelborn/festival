// import external

import request from 'superagent';
import {navigate} from 'react-mini-router';

// import internal

import actions from '../actions/main';
import dispatcher from '../dispatchers/main';
import mCon from '../constants/main';
import Store from '../utilities/store';

// store

const store = new Store();

const defaultState = () => {
	return {
		view: {
			login: {
				user: 'admin',
				password: 'admin'
			},
			upload: {
				files: [],
				key: 0,
				queue: []
			},
			collection: {
				id: '',
				_id: '',
				title: '',
				description: '',
				children: [],
				items: [],
				parent: false
			},
			image: {
				id: '',
				tags: [],
				title: '',
				description: ''
			},
			video: {
				id: '',
				tags: [],
				title: '',
				description: ''
			}
		}
	};
};

function throttle (fn, delay) {
	let timer = null;
	return function () {
		let context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

store.dispatchToken = dispatcher.register(action => {
	const {data, type, id} = action;
	let {state} = store;

	console.info(`store ${type}${data === undefined ? ' ' + JSON.stringify(data) : ''}`);

	const uploadElement = document.getElementById('uploadAddFiles');

	switch (type) {
		case mCon.hydrate:
			Object.assign(state, data, defaultState());
		break;

		// collection view

		case mCon.view.collection.setId:
			state.view.collection = Object.assign(defaultState().view.collection, {
				id: data
			});
			request
				.get(`/api/v1.0/collection/${state.view.collection.id || ''}`)
				.end((error, response) => {
					if (error) return console.error(error);
					Object.assign(state.view.collection, response.body);
					store.emitChange();
				});
		break;

		case mCon.view.collection.create:
			request
				.post(`/api/v1.0/collection/`)
				.send({
					title: data,
					parent: state.view.collection._id,
					description: ''
				})
				.end((error, response) => {
					if (error) {
						sweetAlert(`Couldn't Save`, `Something went wrong trying to save. Perhaps the title isn't unique?`, 'error');
						return console.error(error);
					}
					navigate(`/${response.body._id}`);
					console.info(response);
				});
		break;

		case mCon.view.collection.upload:
			navigate('/upload');
			setTimeout(() => {
				if (!state.view.upload.files.length) return sweetAlert('No Files Selected', 'Use the upload tab to select files.', 'error');
				actions.view.upload.queueAll();
			}, 0);
		break;

		case mCon.view.collection.changeTitle:
			state.view.collection.title = data;
		break;

		case mCon.view.collection.changeDescription:
			state.view.collection.description = data;
		break;

		// login view

		case mCon.view.login.user.change:
			state.view.login.user = data;
		break;

		case mCon.view.login.password.change:
			state.view.login.password = data;
		break;

		case mCon.view.login.ok:
			request
				.put('/api/v1.0/login')
				.send({
					user: state.view.login.user,
					password: state.view.login.password
				})
				.end((error, response) => {
					if (error) {
						sweetAlert('Oops...', 'That\'s not the right password.', 'error');
						return console.error(error);
					}
					state.isLoggedIn = response.body.isLoggedIn;
					state.isAdmin = response.body.isAdmin;

					Object.assign(state.view.login, defaultState().view.login);

					store.emitChange();
				});
		break;

		// upload

		case mCon.view.upload.queueAll:
			state.view.upload.queue = state.view.upload.files.map(item => {
				delete item.preview;
				item.percent = 0;
				item.parent = {
					_id: state.view.collection._id,
					title: state.view.collection.title
				};
				return item;
			});
			state.view.upload.files = [];
			setTimeout(actions.view.upload.one, 0);
		break;

		case mCon.view.upload.one:
			const file = state.view.upload.queue[0];
			console.log(file);
			request
				.post(`/api/v1.0/media/`)
				.attach('file', file.file)
				.field('title', file.title)
				.field('description', file.description)
				.field('parent', file.parent._id)
				.on('progress', throttle(function (e) {
					file.percent = e.percent;
					console.log(e.percent);
					store.emitChange();
				}, 25))
				.end((error, response) => {
					if (error) return console.error(error);
					console.info(response);
					state.view.upload.queue.shift();
					store.emitChange();
					if (state.view.upload.queue.length) {
						actions.view.upload.one();
					} else {
						sweetAlert({
							title: 'Upload finished!',
							type: 'success'
						});
					}
				});
		break;

		case mCon.view.upload.files.add:
			uploadElement.click();
		break;

		case mCon.view.upload.files.added:
			for (let i = 0; i < uploadElement.files.length; i++) {
				const file = uploadElement.files[i];

				if (file.type.startsWith('image/')) {
					const reader = new FileReader();
					const url = reader.readAsDataURL(file);
					reader.onloadend = e => {
						state.view.upload.files.push({
							file,
							title: file.name,
							description: '',
							preview: e.target.result,
							key: state.view.upload.key++
						});
						store.emitChange();
					};
				} else {
					state.view.upload.files.push({
						file,
						title: file.name,
						description: '',
						preview: false,
						key: state.view.upload.key++
					});
				}
			}
		break;

		case mCon.view.upload.files.selectFolder:
			navigate(`/${state.view.collection._id}`);
		break;

		case mCon.view.upload.files.clear:
			state.view.upload.files = [];
		break;

		case mCon.view.upload.item.remove:
			state.view.upload.files.splice(id, 1);
		break;

		case mCon.view.upload.item.changeTitle:
			state.view.upload.files[id].title = data;
		break;

		case mCon.view.upload.item.changeDescription:
			state.view.upload.files[id].description = data;
		break;

		// image

		case mCon.view.image.setId:
			state.view.image.id = data;
			request
				.get(`/api/v1.0/meta/${state.view.image.id}`)
				.end((error, response) => {
					if (error) return console.error(error);
					Object.assign(state.view.image, response.body);
					console.info(state.view.image);
					store.emitChange();
				});
		break;

		// video

		case mCon.view.video.setId:
			state.view.video.id = data;
			request
				.get(`/api/v1.0/meta/${state.view.video.id}`)
				.end((error, response) => {
					if (error) return console.error(error);
					Object.assign(state.view.video, response.body);
					console.info(state.view.video);
					store.emitChange();
				});
		break;

		// session

		case mCon.session.destroy:
			request
				.delete('/api/v1.0/login')
				.end((error, response) => {
					if (error) return console.error(error);
					state.isLoggedIn = false;
					state.isAdmin = false;
					store.emitChange();
				});
		break;
	}

	store.emitChange();
});

// export

export default store;
