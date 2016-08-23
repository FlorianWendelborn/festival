// import external

import koaRouter from 'koa-router';

// import internal

import loginRouter from './login';
import collectionRouter from './collection';
import mediaRouter from './media';
import metaRouter from './meta';

// code

const router = koaRouter();

router.use('/login', loginRouter.routes(), loginRouter.allowedMethods());
router.use('/collection', collectionRouter.routes(), collectionRouter.allowedMethods());
router.use('/media', mediaRouter.routes(), mediaRouter.allowedMethods());
router.use('/meta', metaRouter.routes(), metaRouter.allowedMethods());

// export

export default router;
