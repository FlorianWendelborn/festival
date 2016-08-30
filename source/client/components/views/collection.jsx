// import external

import {navigate} from 'react-mini-router';
import React from 'react';
import sweetAlert from 'sweetalert2';
import ReactDisqusThread from 'react-disqus-thread';

// import internal

import CollectionFractal from '../fractals/collection';

// export

export default class CollectionView extends CollectionFractal {

	render () {

		const {actions, id, state} = this.props;

		const container = state.isAdmin ? (
			<div className="container">
				<h1 className="jumbotron-heading"><input type="text" className="form-control" value={state.view.collection.title} onChange={actions.changeTitle}/></h1>
				<p className="lead text-muted"><textarea className="form-control" value={state.view.collection.description} onChange={actions.changeDescription}/></p>
			</div>
		) : (
			<div className="container text-xs-center">
				<h1 className="jumbotron-heading">{state.view.collection.title}</h1>
				<p className="lead">{state.view.collection.description}</p>
			</div>
		);

		const backButton = state.view.collection.parent ? (
			<button className="btn btn-primary" onClick={this.back.bind(this)}>Back</button>
		) : null;

		const buttons = state.isAdmin ? (
			<div className="btn-group">
				{backButton}
				<button className="btn btn-success" onClick={actions.create}>Create Collection</button>
				<button className="btn btn-primary" onClick={actions.upload}>Upload Here</button>
				<button className="btn btn-warning" onClick={actions.save}>Save</button>
			</div>
		) : backButton;

		return (
			<main>
				<div className="canvas-jumbo">
					<canvas id="collection-canvas"></canvas>
					<div id="collection-target" className="jumbotron custom-no-border">
						{container}
						<div className="text-xs-center">{buttons}</div>
					</div>
				</div>
				<ItemView actions={actions} state={state.view.collection}/>
				<div className="container">
					<ReactDisqusThread
						shortname="grabow-vision"
						identifier={id}
						title={state.title}
						url={window.location.href}
					/>
				</div>
			</main>
		);
	}

	back () {
		navigate(`/${this.props.state.view.collection.parent}`);
	}

}

export class ItemView extends React.Component {

	render () {
		const {actions, state} = this.props;

		const children = [], items = [];
		state.children.forEach(item => children.push(
			<Folder key={item._id} state={item}/>
		));
		state.items.forEach(item => items.push(
			<Item key={item._id} state={item}/>
		));

		const empty = !state._id ? (
			<div className="text-xs-center">
				<div className="sk-cube-grid">
					<div className="sk-cube sk-cube1"></div>
					<div className="sk-cube sk-cube2"></div>
					<div className="sk-cube sk-cube3"></div>
					<div className="sk-cube sk-cube4"></div>
					<div className="sk-cube sk-cube5"></div>
					<div className="sk-cube sk-cube6"></div>
					<div className="sk-cube sk-cube7"></div>
					<div className="sk-cube sk-cube8"></div>
					<div className="sk-cube sk-cube9"></div>
				</div>
			</div>
		) : (
			<div className="text-xs-center" style={{color: '#CCC'}}>
				<h3>Nothing, literally nothing.</h3>
			</div>
		);

		const isEmpty = !children.length && !items.length;

		return (
			<div className="custom-card-container">
				{isEmpty ? empty : (
					<div className="card-columns">
						{children}
						{items}
					</div>
				)}
			</div>
		);
	}

}

export class Folder extends React.Component {

	constructor () {
		super();
		this.state = {
			loaded: false
		};
	}

	render () {
		const {actions, state} = this.props;

		const firstChild = state.items[0] || false;

		const image = firstChild ? (
			<img onLoad={this.didLoad.bind(this)} className="card-img" src={`/api/v1.0/media/${firstChild}-s.jpg`}/>
		) : (
			<img onLoad={this.didLoad.bind(this)} className="card-img" src="https://placehold.it/512x512"/>
		);

		return (
			<div onClick={this.show.bind(this)} style={{display: this.state.loaded ? 'inline-block' : 'none'}} className="card card-inverse custom-card-image custom-card-folder">
				{image}
				<div className="card-img-overlay">
					<h4 className="card-title">{state.title}</h4>
					<p className="card-text">{state.description}</p>
				</div>
			</div>
		);
	}

	didLoad () {
		this.setState({
			loaded: true
		});
	}

	show () {
		navigate(`/${this.props.state._id}`);
	}

}

export class Item extends React.Component {

	constructor () {
		super();
		this.state = {
			loaded: false
		};
	}

	render () {
		const {actions, state} = this.props;

		return (
			<div style={{display: this.state.loaded ? 'inline-block' : 'none'}} onClick={this.show.bind(this)} className="card custom-card-image">
				<img onLoad={this.didLoad.bind(this)} className="card-img" src={`/api/v1.0/media/${state._id}-s.jpg`}/>
			</div>
		);
	}

	didLoad () {
		this.setState({
			loaded: true
		});
	}

	show () {
		navigate(`/${this.props.state.fileType}/${this.props.state._id}`);
	}
}
