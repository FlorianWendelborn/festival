// import external

import {navigate} from 'react-mini-router';
import React from 'react';
import sweetAlert from 'sweetalert2';

// export

export default class ImageView extends React.Component {

	render () {

		const {actions, id, state} = this.props;

		if (state.id !== id) {
			setTimeout(() => actions.setId(id), 0);
		}

		const tags = [];
		let i = 0;
		state.tags.forEach(tag => {
			tags.push(
				<span key={i++} className="tag tag-default">{tag}</span>
			);
			tags.push(' ');
		});

		return (
			<main className="container">
				<h3><button onClick={this.back.bind(this)} className="btn btn-primary">Back To Collection</button> {state.title}</h3>
				<p>{state.description} {tags}</p>
				<video style={{width: '100%'}} autoPlay="true" controls="true" autoPlay="true" poster={`/api/v1.0/media/${id}-s-2.jpg`}>
					<source src={`/api/v1.0/media/${id}.mp4`} type="video/mp4"/>
				</video>
			</main>
		);
	}

	back () {
		navigate(`/${this.props.state.parent}`);
	}
}
