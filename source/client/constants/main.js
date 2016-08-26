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
				add: 'view.upload.files.add',
				added: 'view.upload.files.added',
				clear: 'view.upload.files.clear',
				selectFolder: 'view.upload.files.selectFolder'
			},
			item: {
				changeTitle: 'view.upload.item.changeTitle',
				changeDescription: 'view.upload.item.changeDescription',
				remove: 'view.upload.item.remove'
			},
			queueAll: 'view.upload.queueAll',
			one: 'view.upload.one'
		},
		collection: {
			setId: 'view.collection.setId',
			create: 'view.collection.create',
			upload: 'view.collection.upload',
			changeTitle: 'view.collection.changeTitle',
			changeDescription: 'view.collection.changeDescription'
		},
		image: {
			setId: 'view.image.setId'
		},
		video: {
			setId: 'view.video.setId'
		}
	},
	session: {
		destroy: 'session.destroy'
	}
};
