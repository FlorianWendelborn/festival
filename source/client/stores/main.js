// import external

import request from 'superagent';
import {navigate} from 'react-mini-router';

// import internal

import Store from '../utilities/store';

import dispatcher from '../dispatchers/main';
import mCon from '../constants/main';
import actions from '../actions/main';

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
				key: 0
			},
			collection: {
				id: '',
				title: '',
				description: '',
				children: [],
				items: []
			}
		}
	};
};

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
			state.view.collection.id = data;
			request
				.get(`/api/v1.0/collection/${state.view.collection.id || ''}`)
				.end((error, response) => {
					if (error) return console.error(error);
					Object.assign(state.view.collection, response.body);
					store.emitChange();
				});
		break;

		case mCon.view.collection.create:
			console.log(`creating ${data}`);
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
