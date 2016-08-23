// import external

import React from 'react';

// export

export default class LoginView extends React.Component {

	render () {

		const {actions, state} = this.props;

		return (
			<main className="container form-signin">
				<h2>Enter Password</h2>
				<input type="text" className="form-control" placeholder="Username" required value={state.user} onChange={actions.user.change}/>
				<input type="password" className="form-control" placeholder="Password" required autoFocus value={state.password} onChange={actions.password.change}/>
				<button className="btn btn-lg btn-primary btn-block" onClick={actions.ok}>Sign in</button>
			</main>
		);
	}

}
