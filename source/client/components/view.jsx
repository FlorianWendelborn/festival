// import external

import React from 'react';
import {RouterMixin, navigate} from 'react-mini-router';

// import internal

import CollectionView from './views/collection';
import ImageView from './views/image';
import LoginView from './views/login';
import UploadView from './views/upload';
import VideoView from './views/video';

// export

export default React.createClass({
	mixins: [RouterMixin],

	routes: {
		'/login': 'login',
		'/upload': 'upload',
		'/image/:id': 'image',
		'/video/:id': 'video',
		'/': 'collection',
		'/:id': 'collection'
	},

	render () {
		return this.renderCurrentRoute();
	},

	collection (id) {
		this.view('collection');

		if (typeof id !== 'string') id = false;

		const {actions, state} = this.props;

		this.isLoggedIn(state, true);

		if (state.view.collection.id !== id) {
			setTimeout(() => actions.view.collection.setId(id), 0);
		}

		return (
			<CollectionView actions={actions.view.collection} state={state} id={id}/>
		);
	},

	upload () {
		this.view('upload');

		const {actions, state} = this.props;

		this.isAdmin(state);
		this.isLoggedIn(state, true);

		return (
			<UploadView actions={actions.view.upload} state={state}/>
		);
	},

	login () {
		this.view('login');

		const {actions, state} = this.props;

		this.isLoggedIn(state, false);

		return (
			<LoginView actions={actions.view.login} state={state.view.login}/>
		);
	},

	image (id) {
		this.view('image');

		const {actions, state} = this.props;

		this.isLoggedIn(state, true);

		return (
			<ImageView actions={actions.view.image} state={state.view.image} id={id}/>
		);
	},

	video (id) {
		this.view('video');

		const {actions, state} = this.props;

		this.isLoggedIn(state, true);

		return (
			<VideoView actions={actions.view.video} state={state.view.video} id={id}/>
		);
	},

	isLoggedIn (state, condition) {
		setTimeout(() => {
			if (state.isLoggedIn !== condition) navigate(state.isLoggedIn ? '/' : '/login');
		}, 0);
	},

	isAdmin (state) {
		setTimeout(() => {
			if (!state.isAdmin) navigate('/');
		}, 0);
	},

	view (name) {
		document.body.className = `view-${name}`;
	},

	notFound (path) {
		console.log(`${path} not found`);
		setTimeout(() => navigate('/'), 0);
		return (
			<main className="container">
				not found
			</main>
		);
	}
});
