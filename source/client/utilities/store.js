import EventEmitter from 'events';

let _state = {};

let CHANGE = 'CHANGE';

class Store extends EventEmitter {
	constructor () {
		super();
		this.state = {};
	}

	getState () {
		return this.state;
	}

	emitChange () {
		this.emit(CHANGE);
	}

	addChangeListener (callback) {
		this.on(CHANGE, callback);
	}

	removeChangeListener (callback) {
		this.removeListener(CHANGE, callback);
	}
}

Store.dispatchToken = null;

export default Store;
