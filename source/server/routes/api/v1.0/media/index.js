// import external

import koaRouter from 'koa-router';
import send from 'koa-send';
import path from 'path';
import fs from 'fs';
import parse from 'co-busboy';
import os from 'os';

// import internal

import config from '../../../../config';

// code

const router = koaRouter();

router.get('/:id', function * () {
	yield send(this, this.params.id, {
		root: config.storage.path
	});
});

router.post('/', function * () {
	const parts = parse(this);
	const part = yield parts;

	const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
	part.pipe(stream);
	console.log(`uploading ${part.filename}/${part.fieldname}/${part.mimeType} -> ${stream.path}`);
	console.log(Object.keys(part));
});

// export

export default router;
