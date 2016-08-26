// import external

import genericSession from 'koa-generic-session';
import MongooseStore from 'koa-session-mongoose';

// import internal

import config from '../config';

// export

export default genericSession({
	store: new MongooseStore({
		collection: config.session.collection
	})
});
