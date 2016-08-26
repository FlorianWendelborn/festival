// import external

import koaRouter from 'koa-router';
import koaBody from 'koa-body';
import async from 'neo-async';

// import internal

import {Collection, Item} from '../../../../database/models';
import {isAdmin} from '../../../../utilities/security';

// code

const router = koaRouter();
const body = koaBody();

router.post('/', isAdmin, body, function * () {
	const {description, parent, title} = this.request.body;

	const created = new Collection({
		title,
		parent,
		description,
		children: [],
		items: []
	});

	try {
		yield created.save();
		yield Collection.findOne({
			_id: parent
		}).then(parent => {
			parent.children.push(created._id);
			return parent.save();
		});
		this.body = {
			success: true,
			_id: created._id
		};
	} catch (error) {
		this.body = {
			error: 'something went wrong'
		};
		this.status = 500;
		console.error(error);
	}
});

router.get('/', handleCollection);
router.get('/:_id', handleCollection);

function * handleCollection () {

	const {_id} = this.params;

	let item;
	if (_id) {
		item = yield Collection.findOne({_id});
	} else {
		item = yield Collection.findOne({
			role: 'root'
		});
	}
	if (!_id && !item) {
		this.body = {
			error: 'missing root collection'
		};
		this.status = 500;
	} else {
		const names = yield loadNames(item);
		const cleanChild = data => {
			return {
				title: data.title,
				_id: data._id,
				firstChild: data.items[0] || false
			};
		};
		const cleanItem = data => {
			return {
				title: data.title,
				_id: data._id,
				tags: data.tags,
				fileType: data.fileType
			};
		};
		this.body = {
			title: item.title,
			description: item.description,
			children: names[0].map(cleanChild),
			items: names[1].map(cleanItem),
			_id: item._id,
			parent: item.parent
		};
	}
}

// helper methods

function loadNames (item) {
	return new Promise((resolve, reject) => {
		async.map(item.children, (_id, index, done) => {
			Collection.findOne({_id}, done);
		}, (error, result) => {
			async.map(item.items, (_id, index, done) => {
				Item.findOne({_id}, done);
			}, (error2, result2) => {
				if (error || error2) return reject(error || error2);
				resolve([result, result2]);
			});
		});
	});
}

// export

export default router;
