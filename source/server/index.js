// import external

import 'babel-polyfill';
import http from 'http';
import koa from 'koa';
import koaStatic from 'koa-static';
import koaMount from 'koa-mount';
import path from 'path';
import mongoose from 'mongoose';

// import internal

import config from './config';
import router from './routes';
import {Collection} from './database/models';

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
// app.use(koaMount('/api/v1.0/temporary/', koaStatic(config.storage.temporary)));
app.use(router.routes(), router.allowedMethods());

// initial setup

Collection.findOne({
	role: 'root'
}).then(item => {
	if (!item) {
		const item = new Collection({
			title: 'All Media',
			description: 'All Media Files',
			role: 'root',
			children: [],
			items: []
		});
		console.warn('creating root collection');
		item.save().catch(console.error);
	} else {
		console.info('root collection exists');
	}
});
