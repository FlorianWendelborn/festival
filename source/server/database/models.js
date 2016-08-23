// import external
import mongoose from 'mongoose';

// import internal
import {collectionSchema, itemSchema, temporarySchema} from './schemas';

// defined models
export const Collection = mongoose.model('collection', collectionSchema);
export const Item = mongoose.model('item', itemSchema);
export const Temporary = mongoose.model('temporary', temporarySchema);
