// import external

import React from 'react';
import ReactDOM from 'react-dom/server';

// import internal

import config from '../config';

// component

export class Document extends React.Component {

	render () {
		return (
			<html>
				<head>
					<title>{config.info.name}</title>
					<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.3/css/bootstrap.min.css" integrity="sha384-MIwDKRSSImVFAZCVLtU0LMDdON6KVCrZHyVQQj6e8wIEJkW4tvwqXrbMIya1vriY" crossorigin="anonymous"/>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/sweetalert2/4.1.9/sweetalert2.min.css" integrity="sha384-/FUpItDlOoE1UCywy6WqQBrsDnUYQNB+v4jMgZyVlv7pSmPgNub5tYEVTHUOwjaU" crossorigin="anonymous"/>
					<link rel="stylesheet" href="./style/main.css"/>
					<script src="http://code.jquery.com/jquery-3.1.0.slim.min.js" integrity="sha256-cRpWjoSOw5KcyIOaZNo4i6fZ9tKPhYYb6i5T9RSVJG8=" crossorigin="anonymous"/>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.3.4/js/tether.min.js" integrity="sha384-yacJg5r/trYB82m2y+UHKTdBhdzKZAB+IDxN5gZcVIf/GruDEsarUdSzPMx5m9XH" crossorigin="anonymous" />
					<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.3/js/bootstrap.min.js" integrity="sha384-ux8v3A6CPtOTqOzMKiuo3d/DomGaaClxFYdCu2HPMBEkf6x2xiDyJ7gkXU0MWwaD" crossorigin="anonymous"/>
					<script>
						window.INITIAL_DATA = REPLACE;
					</script>
					<script src="bundle/main.js"/>
				</head>
				<body>
					<div id="react"/>
				</body>
			</html>
		);
	}

}

// render

export default function render (session) {
	return ReactDOM.renderToStaticMarkup(<Document/>).replace('REPLACE', `'${JSON.stringify({
		info: {
			name: config.info.name
		},
		isAdmin: session.isAdmin || false,
		isLoggedIn: session.isLoggedIn || false
	})}'`);
}
