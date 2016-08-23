export default {
	hydrate: 'hydrate',
	view: {
		login: {
			user: {
				change: 'view.login.user.change'
			},
			password: {
				change: 'view.login.password.change',
			},
			ok: 'view.login.ok'
		},
		upload: {
			files: {
				add: 'view.uploads.files.add',
				added: 'view.uploads.files.added',
				clear: 'view.uploads.files.clear'
			},
			item: {
				changeTitle: 'view.uploads.item.changeTitle',
				changeDescription: 'view.uploads.item.changeDescription',
				remove: 'view.uploads.item.remove'
			}
		},
		collection: {
			setId: 'view.collection.setId',
			create: 'view.collection.create'
		}
	},
	session: {
		destroy: 'session.destroy'
	}
};
