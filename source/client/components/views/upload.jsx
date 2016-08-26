// import external

import fileSize from 'file-size';
import React from 'react';

// import internal

import UploadFractal from '../fractals/upload';

// export

export default class CollectionView extends UploadFractal {

	render () {

		const {actions, state} = this.props;

		const scheduledForUpload = [], uploading = [];
		state.view.upload.files.forEach((file, id) => {
			scheduledForUpload.push(<UploadItem id={id} key={file.key} actions={actions} state={file}/>)
		});
		state.view.upload.queue.forEach((file, id) => {
			uploading.push(<UploadingItem id={id} key={file.key} actions={actions} state={file}/>)
		});

		return (
			<main>
				<div className="canvas-jumbo">
					<canvas id="upload-canvas"></canvas>
					<div id="upload-target" className="jumbotron text-xs-center custom-no-border">
						<div className="container">
							<h1 className="jumbotron-heading">Upload Files</h1>
							<div className="list-group custom-margin-fix">
								{scheduledForUpload}
							</div>
							<input type="file" id="uploadAddFiles" multiple className="custom-hidden" accept="video/mp4,video/x-m4v,video/mov,video/quicktime,video/*,image/*" onChange={actions.files.added}/>
						</div>
						<div className="btn-group">
							<button className="btn btn-success" onClick={actions.files.add}>Add Files</button>
							<button className="btn btn-danger" onClick={actions.files.clear}>Remove All</button>
							<button className="btn btn-info" onClick={actions.files.selectFolder}>Select Folder</button>
						</div>
					</div>
				</div>
				{state.view.upload.queue.length ? (
					<div className="container custom-margin-fix">
						<h2>Uploads <small className="text-muted">in progress</small></h2>
						<div className="list-group">
							{uploading}
						</div>
					</div>
				) : null}
				<div className="container custom-margin-fix">
					<h2>Conversions <small className="text-muted">in progress</small></h2>
					<div className="list-group">
						<a href="" className="list-group-item list-group-item-action">example</a>
						<a href="" className="list-group-item list-group-item-action">example</a>
						<a href="" className="list-group-item list-group-item-action">example</a>
						<a href="" className="list-group-item list-group-item-action">example</a>
					</div>
				</div>
				<div className="container custom-margin-fix">
					<h2>Image Recognition <small className="text-muted">in progress</small></h2>
					<div className="list-group">
						<a href="" className="list-group-item list-group-item-action">example</a>
						<a href="" className="list-group-item list-group-item-action">example</a>
						<a href="" className="list-group-item list-group-item-action">example</a>
						<a href="" className="list-group-item list-group-item-action">example</a>
					</div>
				</div>
			</main>
		);
	}

}

export class UploadItem extends React.Component {

	render () {

		const {actions, id, state} = this.props;

		const preview = state.preview ? (
			<img className="img-rounded pull-xs-right" style={{width: '100%'}} src={state.preview}/>
		) : 'No Preview';

		return (
			<div className="list-group-item">
				<div className="row">
					<div className="col-md-8">
						<div className="form-group row">
							<label className="col-xs-2 col-form-label text-xs-right">Title</label>
							<div className="col-xs-10">
		 						<input type="text" className="form-control" value={state.title} onChange={this.changeTitle.bind(this)} placeholder="Title"/>
							</div>
						</div>
						<div className="form-group row">
							<label className="col-xs-2 col-form-label text-xs-right">Description</label>
							<div className="col-xs-10">
								<textarea rows="5" className="form-control" value={state.description} onChange={this.changeDescription.bind(this)} placeholder="Description"></textarea>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-6 col-xl-2 text-xs-right">Size:</div>
							<div className="col-xs-6 col-xl-2">{fileSize(state.file.size).human()}</div>
							<div className="col-xs-6 col-xl-2 text-xs-right">Type:</div>
							<div className="col-xs-6 col-xl-2">{state.file.type}</div>
							<div className="col-xs-12 col-xl-2 offset-xl-2">
								<div className="btn btn-danger btn-block" onClick={this.remove.bind(this)}>Remove</div>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						{preview}
					</div>
				</div>
			</div>
		);
	}

	remove () {
		const {actions, id} = this.props;

		actions.item.remove(id);
	}

	changeDescription (e) {
		const {actions, id} = this.props;

		actions.item.changeDescription(id, e.target.value);
	}

	changeTitle (e) {
		const {actions, id} = this.props;

		actions.item.changeTitle(id, e.target.value);
	}

}

export class UploadingItem extends React.Component {

	render () {

		const {actions, id, state} = this.props;

		return (
			<div className="list-group-item">
				<div className="form-group row">
					<label className="col-xs-2 col-form-label text-xs-right">Title</label>
					<div className="col-xs-4">
						{state.title}
					</div>
					<div className="col-xs-6">
						<progress className="progress" value={state.percent} max="100"/>
					</div>
				</div>
				<div className="form-group row">
					<label className="col-xs-2 col-form-label text-xs-right">Description</label>
					<div className="col-xs-10">
						{state.description}
					</div>
				</div>
				<div className="row">
					<div className="col-xs-6 col-xl-2 text-xs-right">Size:</div>
					<div className="col-xs-6 col-xl-2">{fileSize(state.file.size).human()}</div>
					<div className="col-xs-6 col-xl-2 text-xs-right">Type:</div>
					<div className="col-xs-6 col-xl-2">{state.file.type}</div>
				</div>
			</div>
		);
	}

}
