// import external

import React from 'react';

// import internal

import actions from '../actions/main';
import store from '../stores/main';

import Header from './header';
import View from './view';

// export

export default class Main extends React.Component {

	constructor () {
		super();
		this.state = store.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount () {
		store.addChangeListener(this.onChange);
	}

	componentWillUnmount () {
		store.removeChangeListener(this.onChange);
	}

	onChange () {
		this.setState(store.getState());
	}

	render () {
		return (
			<div>
				<Header actions={actions} state={this.state}/>
				<View history={false} actions={actions} state={this.state}/>
			</div>
		);
	}

}
