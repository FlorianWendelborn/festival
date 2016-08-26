// import external

import koaRouter from 'koa-router';
import stream from 'koa-stream';
import koaBody from 'koa-body';
import path from 'path';
import fs from 'fs';

// import internal

import {checkTemporary} from '../../../../utilities/temporary';
import {isAdmin} from '../../../../utilities/security';
import {Temporary} from '../../../../database/models';
import config from '../../../../config';

// code

const router = koaRouter();
const body = koaBody({
	multipart: true,
	formidable: {
		uploadDir: config.storage.temporary,
		keepExtensions: true
	}
});

router.get('/:id', function * () {
	yield stream.file(this, this.params.id, {
		root: config.storage.permanent,
		allowDownload: true
	});
});

router.post('/', isAdmin, body, function * () {
	const {description, parent, title} = this.request.body.fields;
	const file = this.request.body.files.file;
	const dbObject = new Temporary({
		title,
		description,
		path: file.path,
		mimeType: file.type,
		parent,
		original: {
			lastModified: file.lastModifiedDate,
			name: file.name
		}
	});
	yield dbObject.save();
	this.body = {
		success: true
	};
	checkTemporary();
});

// export

export default router;
