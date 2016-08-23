// import external

import koaRouter from 'koa-router';

// import internal

import {Temporary} from '../../../../database/models';

// code

const router = koaRouter();

router.get('/', function * () {
	const response = yield Temporary.find();
	if (response) {
		this.body = response;
	} else {
		this.status = 500;
		this.body = {
			error: 'internal server error'
		}
	}
});

router.get('/:_id', function * () {
	const response = yield Temporary.findOne(this.params);

	if (response) {
		this.body = response;
	} else {
		this.status = 404;
		this.body = {
			error: 'not found'
		};
	}
});

// export

export default router;
