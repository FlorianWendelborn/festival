// import external

import koaRouter from 'koa-router';

// import internal

import {Item} from '../../../../database/models';

// code

const router = koaRouter();

router.get('/:tag', function * () {

	const {tag} = this.params;

	const response = yield Item.find({
		tags: tag
	});

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
