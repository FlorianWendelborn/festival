export default Object.assign(
	{
		listen: {
			address: '0.0.0.0',
			port: 80,
			publicUrl: 'http://localhost:3000',
		},
		info: {
			name: 'Festival',
			link: 'http://localhost:3000',
		},
		json: {
			pretty: true,
		},
		storage: {
			permanent: __dirname + '/../../storage/permanent',
			temporary: __dirname + '/../../storage/temporary',
		},
		monitor: {
			active: true,
			path: '/status',
		},
		mongodb: {
			url: 'mongodb://127.0.0.1:27017/festival',
			debug: true,
		},
		clarifai: {
			id: 'clarifai-id',
			secret: 'clarifai-secret',
		},
		session: {
			keys: [
				'IMPORTANT: CHANGE THIS STRING, OTHERWISE YOUR SERVER CAN BE COMPROMISED EASILY',
			],
			collection: 'session',
		},
		admin: {
			user: 'admin',
			password: 'admin',
		},
		normal: {
			user: 'user',
			password: 'user',
		},
	},
	require('../../config.json')
)
