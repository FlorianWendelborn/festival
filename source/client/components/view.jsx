// import external

import React from 'react';
import {RouterMixin, navigate} from 'react-mini-router';

// import internal

import CollectionView from './views/collection';
import LoginView from './views/login';
import UploadView from './views/upload';

// export

export default React.createClass({
	mixins: [RouterMixin],

	routes: {
		'/login': 'login',
		'/upload': 'upload',
		'/': 'home',
		'/:id': 'home'
	},

	render () {
		return this.renderCurrentRoute();
	},

	home (id) {

		if (typeof id !== 'string') id = false;

		const {actions, state} = this.props;

		this.isLoggedIn(state, true);

		return (
			<CollectionView actions={actions.view.collection} state={state} id={id}/>
		);
	},

	upload () {

		const {actions, state} = this.props;

		this.isLoggedIn(state, true);
		this.isAdmin(state);

		return (
			<UploadView actions={actions.view.upload} state={state}/>
		);
	},

	login () {

		const {actions, state} = this.props;

		this.isLoggedIn(state, false);

		return (
			<LoginView actions={actions.view.login} state={state.view.login}/>
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
