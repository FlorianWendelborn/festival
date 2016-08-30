// import external

import koaRouter from 'koa-router';
import koaBody from 'koa-body';

// import internal

import {Collection, Item} from '../../../../database/models';
import {isAdmin} from '../../../../utilities/security';
import filter from '../../../../utilities/filter';

// code

const router = koaRouter();
const body = koaBody();

router.post('/', isAdmin, body, function* () {
	const {description, parent, title} = this.request.body;

	const created = new Collection({
		title,
		parent,
		description,
		children: [],
		items: []
	});

	yield created.save();
	yield Collection.findByIdAndUpdate(parent, {
		$push: {
			children: created._id
		}
	}, {
		safe: true,
		upsert: true
	});

	this.body = {
		success: true,
		_id: created._id
	};
});

router.get('/', function* () {
	const root = yield Collection.findOne({
		role: 'root'
	});

	if (!root) {
		this.status = 500;
		return this.body = {
			error: 'missing root collection'
		};
	}

	this.redirect(`/api/v1.0/collection/${root._id}`);
});

router.get('/:_id', function* () {

	const {_id} = this.params;

	let item = yield Collection.findOne({_id});

	// load child information

	const children = yield Collection.find({
		_id: {
			$in: item.children
		}
	}, filter.childCollections);

	const items = yield Item.find({
		_id: {
			$in: item.items
		}
	}, filter.childItems);

	// respond

	this.body = filter.collectionResult({children, item, items});
});

// export

export default router;
