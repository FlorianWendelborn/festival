// import external

import {default as mongoose, Schema} from 'mongoose';
import {isEmail, isAlphanumeric, isHexadecimal} from 'validator';
import isValidId from 'mongoose-id-validator';

// export

mongoose.Promise = Promise;
export const collectionSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: false
	},
	description: {
		type: String,
		required: false,
		unique: false
	},
	role: String,
	children: [{
		id: {
			type: Schema.Types.ObjectId,
			ref: 'collection',
			required: true
		}
	}],
	items: [{
		id: {
			type: Schema.Types.ObjectId,
			ref: 'item',
			required: true
		}
	}]
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
		required: true,
		unique: false
	},
	fileType: {
		type: String,
		required: true
	},
	tags: {
		type: [String],
		default: [],
		required: true,
		unique: false
	}
});



export const temporarySchema = new Schema({
	mimeType: {
		type: String,
		required: true,
		unique: false
	},
	stage: {
		type: Number,
		required: true,
		default: 0
	},
	name: {
		type: String,
		required: true,
		unique: false
	},
	tags: {
		type: [String],
		default: [],
		required: true,
		unique: false
	}
});
