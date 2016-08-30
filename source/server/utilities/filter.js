// mongoose filters

export const childCollections = 'items title';
export const childItems = 'fileType tags title';
export const meta = 'description fileType parent tags title';
export const tagSearchResult = 'fileType tags title';

export function collectionResult ({children, item, items}) {
	return {
		_id: item._id,
		children: children,
		description: item.description,
		items: items,
		parent: item.parent,
		title: item.title
	}
}

export default {
	childCollections,
	childItems,
	collectionResult,
	meta,
	tagSearchResult
};
