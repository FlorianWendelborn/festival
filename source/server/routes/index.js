// import external

import koaRouter from 'koa-router';

// import internal

import apiRouter from './api/v1.0';
import renderMain from '../components/main';
import config from '../config';
import session from '../utilities/session';

// routes

const router = koaRouter();

router.use('/api/v1.0', apiRouter.routes(), apiRouter.allowedMethods());

router.get('/', session, function * () {
	this.body = renderMain(this.session);
});

// export

export default router;
