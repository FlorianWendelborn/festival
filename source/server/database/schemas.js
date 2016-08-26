// import external

import {default as mongoose, Schema} from 'mongoose';
import {isEmail, isAlphanumeric, isHexadecimal} from 'validator';
import isValidId from 'mongoose-id-validator';

// export

mongoose.Promise = Promise;
export const collectionSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ''
	},
	role: String,
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'collection'
	},
	children: [{
		type: Schema.Types.ObjectId,
		ref: 'collection',
		required: true
	}],
	items: [{
		type: Schema.Types.ObjectId,
		ref: 'item',
		required: true
	}]
});
collectionSchema.index({
	parent: 1,
	title: 1
}, {
	unique: true
});
collectionSchema.plugin(isValidId);

export const itemSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: true,
		unique: false
	},
	description: {
		type: String,
		default: '',
		unique: false
	},
	fileType: {
		type: String,
		required: true
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'collection',
		required: true
	},
	tags: {
		type: [String],
		default: [],
		required: true,
		unique: false
	},
	original: {
		hash: {
			type: String,
			unique: true
		}
	}
});
itemSchema.plugin(isValidId);

export const temporarySchema = new Schema({
	mimeType: {
		type: String,
		required: true,
		unique: false
	},
	stage: {
		type: Number,
		default: 0
	},
	title: {
		type: String,
		required: true,
		unique: false
	},
	original: {
		hash: {
			type: String
		},
		lastModified: {
			type: String
		},
		name: {
			type: String
		}
	},
	description: {
		type: String,
		default: ''
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'collection',
		required: true
	},
	path: {
		type: String,
		required: true,
		unique: true
	},
	thumbnailPath: {
		type: String
	},
	screenshots: [{
		type: String
	}],
	tags: {
		type: [String],
		default: [],
		unique: false
	}
});
temporarySchema.plugin(isValidId);
