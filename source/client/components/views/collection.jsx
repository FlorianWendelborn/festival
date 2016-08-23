// import external

import React from 'react';
import sweetAlert from 'sweetalert2';

// export

export default class CollectionView extends React.Component {

	render () {

		const {actions, id, state} = this.props;

		if (state.view.collection.id !== id) {
			actions.setId(id);
		}

		const adminControls = state.isAdmin ? (
			<div className="btn-group">
				<div className="btn btn-primary" onClick={actions.create}>Create Collection</div>
			</div>
		) : null;

		return (
			<main>
				<div className="jumbotron text-xs-center">
					<div className="container">
						<h1 className="jumbotron-heading">{state.view.collection.title}</h1>
						<p className="lead text-muted">{state.view.collection.description}</p>
						{adminControls}
					</div>
				</div>
				<ItemView actions={actions} state={state.view.collection}/>
			</main>
		);
	}
}

export class ItemView extends React.Component {

	render () {
		const {actions, state} = this.props;

		const children = [], items = [];
		state.children.forEach((child, index) => children.push(
			<div key={index} className="card">
				{JSON.stringify(child)}
			</div>
		));
		state.items.forEach((item, index) => items.push(
			<div key={index} className="card">
				{JSON.stringify(item)}
			</div>
		));

		return (
			<div className="container">
				{children}
				{items}
				{(!children.length && !items.length) ? (
					<div className="text-xs-center">
						Nothing To See
					</div>
				) : null}
			</div>
		);
	}

}
