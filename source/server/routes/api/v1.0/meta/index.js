// import external

import koaRouter from 'koa-router';

// import internal

import {Item} from '../../../../database/models';

// code

const router = koaRouter();

router.get('/:_id', function * () {

	const {_id} = this.params;

	const response = yield Item.findOne({_id});

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
