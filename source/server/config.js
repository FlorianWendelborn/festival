export default {
	listen: {
		address: '127.0.0.1',
		port: '8080',
		publicUrl: 'https://example.com'
	},
	info: {
		name: 'Grabow Vision Media',
		link: 'https://example.com'
	},
	json: {
		pretty: true
	},
	storage: {
		path: '/Users/dodekeract/code/festival/storage/permanent',
		temporary: '/Users/dodekeract/code/festival/storage/temporary'
	},
	monitor: {
		active: true,
		path: '/status'
	},
	mongodb: {
		url: 'mongodb://127.0.0.1:27017/festival',
		debug: true
	},
	clarifai: {
		id: '',
		secret: ''
	},
	session: {
		keys: ['IMPORTANT: CHANGE THIS STRING, OTHERWISE YOUR SERVER CAN BE COMPROMISED EASILY'],
		collection: 'session'
	},
	admin: {
		user: 'admin',
		password: 'admin'
	},
	normal: {
		user: 'user',
		password: 'user'
	}
}
