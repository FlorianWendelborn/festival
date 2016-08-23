// import internal

import d from '../dispatchers/main';
import c from '../constants/main';

// export

export default {
	hydrate (data) {
		d.dispatch({
			type: c.hydrate,
			data
		});
	},
	view: {
		login: {
			user: {
				change (e) {
					d.dispatch({
						type: c.view.login.user.change,
						data: e.target.value
					});
				}
			},

			password: {
				change (e) {
					d.dispatch({
						type: c.view.login.password.change,
						data: e.target.value
					});
				}
			},

			ok () {
				d.dispatch({
					type: c.view.login.ok
				});
			}
		},
		upload: {
			files: {
				add () {
					d.dispatch({
						type: c.view.upload.files.add
					});
				},

				added () {
					d.dispatch({
						type: c.view.upload.files.added
					});
				},

				clear () {
					swal({
						title: 'Delete All Files?',
						text: 'You won\'t be able to revert this!',
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes, delete it!'
					}).then(() => {
						d.dispatch({
							type: c.view.upload.files.clear
						});
					});
				}
			},
			item: {
				remove (id) {
					d.dispatch({
						type: c.view.upload.item.remove,
						id
					});
				},
				changeTitle (id, data) {
					d.dispatch({
						type: c.view.upload.item.changeTitle,
						id,
						data
					});
				},
				changeDescription (id, data) {
					d.dispatch({
						type: c.view.upload.item.changeDescription,
						id,
						data
					});
				}
			}
		},
		collection: {
			setId (data) {
				d.dispatch({
					type: c.view.collection.setId,
					data
				});
			},

			create () {
				sweetAlert({
					title: 'Create New Collection',
					text: 'Enter a fancy title.',
					input: 'text',
					showCancelButton: true,
					inputValidator: value => new Promise((resolve, reject) => {
						if (value) return resolve();
						reject('Nice try.');
					})
				}).then(data => {
					d.dispatch({
						type: c.view.collection.create,
						data
					});
				});
			}
		}
	},
	session: {
		destroy () {
			d.dispatch({
				type: c.session.destroy
			});
		}
	}
};
