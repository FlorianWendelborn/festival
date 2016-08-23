// import external

import koaRouter from 'koa-router';
import koaBody from 'koa-body';

// import internal

import config from '../../../../config';

// code

const router = koaRouter();
const body = koaBody();

router.get('/', function * () {
	this.body = {
		isAdmin: this.session.isAdmin
	};
});

router.put('/', body, function * () {

	const {user, password} = this.request.body;

	if (user === config.admin.user && password === config.admin.password) {
		this.session.isAdmin = true;
		this.session.isLoggedIn = true;
		this.body = {
			success: true,
			isAdmin: true,
			isLoggedIn: true
		};
	} else if (user === config.normal.user && password === config.normal.password) {
		this.session.isAdmin = false;
		this.session.isLoggedIn = true;
		this.body = {
			success: true,
			isAdmin: false,
			isLoggedIn: true
		};
	} else {
		this.status = 401;
		this.body = {
			error: 'wrong password'
		};
	}
});

router.delete('/', function * () {
	this.session = null;
	this.body = {
		success: true
	};
});

// export

export default router;
