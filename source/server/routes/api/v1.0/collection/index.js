// import external

import koaRouter from 'koa-router';
import async from 'neo-async';

// import internal

import {Collection} from '../../../../database/models';

// code

const router = koaRouter();

router.get('/', handleCollection);
router.get('/:_id', handleCollection);

function * handleCollection () {

	const {_id} = this.params;

	let item;
	if (_id) {
		item = yield Collection.findOne({_id});
		this.body = yield loadNames(item);
	} else {
		item = yield Collection.findOne({
			role: 'root'
		});
	}
	if (!_id && !item) {
		const item = new Collection({
			title: 'All Media',
			description: 'All Media Files',
			role: 'root',
			children: [],
			items: []
		});
		console.warn('creating root collection');
		item.save().catch(console.error);
		this.body = {
			error: 'creating root collection'
		};
		this.status = 500;
	} else {
		const names = yield loadNames(item);
		this.body = {
			title: item.title,
			description: item.description,
			children: names[0].map(item => item.title),
			items: names[1].map(item => item.title)
		};
	}
}

// helper methods

function loadNames (item) {
	console.log('attempting to load names of', item.children, item.items);
	return new Promise((resolve, reject) => {
		async.map(item.children, (_id, index, done) => {
			Collection.findOne({_id}, done);
		}, (error, result) => {
			async.map(item.items, (_id, index, done) => {
				Items.findOne({_id}, done);
			}, (error2, result2) => {
				if (error || error2) return reject(error || error2);
				resolve([result, result2]);
			});
		});
	});
}

// export

export default router;
