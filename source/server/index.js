// import external

import 'babel-polyfill';
import http from 'http';
import koa from 'koa';
import koaStatic from 'koa-static';
import path from 'path';
import mongoose from 'mongoose';

// import internal

import config from './config';
import router from './routes';

// server

const app = koa();
const server = http.createServer(app.callback());
server.listen(config.listen.port, config.listen.address, () => {
	console.log(`listening on http://${config.listen.address}:${config.listen.port}`);
});

// mongoose

mongoose.Promise = Promise;
mongoose.set('debug', config.mongodb.debug);
mongoose.connection.on('error', error => {
	console.error('mongoose error', error);
});
mongoose.connect(config.mongodb.url, (error) => {
	if (error) {
		console.error(`could not connect to mongo: ${error}`);
	} else {
		console.log('connected to mongodb');
	}
});

// session

app.keys = config.session.keys;

// routes

if (config.monitor.active) {
	const monitor = require('koa-monitor');
	app.use(monitor(server, {
	 	path: config.monitor.path
	}));
}

if (config.json.pretty) {
	app.use(require('koa-json')());
}

app.use(koaStatic(path.join(__dirname, '../client/')));
app.use(router.routes(), router.allowedMethods());
