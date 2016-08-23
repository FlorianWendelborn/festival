// import external

import React from 'react';
import {navigate} from 'react-mini-router';

// export

export default class Header extends React.Component {

	render () {

		const {actions, state} = this.props;

		const items = [[],[]];
		let i = [0, 0];

		if (state.isLoggedIn) {
			if (state.isAdmin) {
				items[0].push(
					<li key={i[0]++} className="nav-item">
						<a className="nav-link" href="#!/upload">Upload</a>
					</li>
				);
				items[1].push(
					<li key={i[1]++} className="nav-item">
						<a className="nav-link" onClick={actions.session.destroy}>Logout (Admin)</a>
					</li>
				);
			} else {
				items[1].push(
					<li key={i[1]++} className="nav-item">
						<a className="nav-link" onClick={actions.session.destroy}>Logout</a>
					</li>
				);
			}
		} else {
			items[1].push(
				<li key={i[1]++} className="nav-item active">
					<a className="nav-link" href="#!/login">Login</a>
				</li>
			);
		}

		return (
			<header>
				<nav className="navbar navbar-static-top navbar-dark bg-inverse custom-no-border">
					<div className="container">
						<a className="navbar-brand" href="#!/">{state.info.name}</a>
						<ul className="nav navbar-nav">
							{items[0]}
						</ul>
						<ul className="nav navbar-nav pull-xs-right">
							{items[1]}
						</ul>
					</div>
				</nav>
			</header>
		);
	}

}
