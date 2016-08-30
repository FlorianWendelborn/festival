// import external

import koaRouter from 'koa-router';

// import internal

import {isLoggedIn} from '../../../utilities/security';
import collectionRouter from './collection';
import loginRouter from './login';
import mediaRouter from './media';
import metaRouter from './meta';
import tagRouter from './tag';
import temporaryRouter from './temporary';
import session from '../../../utilities/session';

// router

const router = koaRouter();

// attach routes

router.use('/collection', session, isLoggedIn, collectionRouter.routes(), collectionRouter.allowedMethods());
router.use('/login'     , session, /* login */ loginRouter     .routes(), loginRouter     .allowedMethods());
router.use('/media'     , session, isLoggedIn, mediaRouter     .routes(), mediaRouter     .allowedMethods());
router.use('/meta'      , session, isLoggedIn, metaRouter      .routes(), metaRouter      .allowedMethods());
router.use('/tag'       , session, isLoggedIn, tagRouter       .routes(), tagRouter       .allowedMethods());
router.use('/temporary' , /* ~for clarifai~ */ temporaryRouter .routes(), temporaryRouter .allowedMethods());

// export

export default router;
