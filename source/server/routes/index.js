// import external

import koaRouter from 'koa-router';
import genericSession from 'koa-generic-session';
import MongooseStore from 'koa-session-mongoose';

// import internal

import apiRouter from './api/v1.0';
import renderMain from '../components/main';
import config from '../config';

// session

const session = genericSession({
	store: new MongooseStore({
		collection: config.session.collection
	})
});

// routes

const router = koaRouter();

router.use('/api/v1.0', session, apiRouter.routes(), apiRouter.allowedMethods());

router.get('/', session, function * () {
	this.body = renderMain(this.session);
});

// export

export default router;
