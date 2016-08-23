// import external

import React from 'react';
import ReactDOM from 'react-dom';

// import internal

import Client from './components/main';
import store from './stores/main';
import actions from './actions/main';

// webcrypto

window.crypt = window.crypto.subtle || window.crypto.webkitSubtle || window.crypto.msSubtle;

// run

window.addEventListener('load', () => {
	actions.hydrate(JSON.parse(window.INITIAL_DATA));
	ReactDOM.render(<Client/>, document.getElementById('react'));
});
