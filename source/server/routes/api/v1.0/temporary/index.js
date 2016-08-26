// import external

import koaRouter from 'koa-router';
import stream from 'koa-stream';

// import internal

import config from '../../../../config';

// code

const router = koaRouter();

router.get('/:id', function * () {
	yield stream.file(this, this.params.id, {
		root: config.storage.temporary,
		allowDownload: true
	});
});

// export

export default router;
