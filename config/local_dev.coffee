#
#	Local Development Config File
#

module.exports=
	log:
		level: 'debug'
	auth:
		accessTokenExpiration: 60 * 60 # seconds (60 Minutes)
	db:
		mysql:
			enable: true
			options:
				host: 'localhost'
				port: 8889
				user: 'root'
				password: 'root'
				database: 'blueprint'
				multipleStatements: true
				minConnections: 2
				maxConnections: 10
				idleTimeoutMillis: 60000
		mongo:
            enable: false
            options: 'mongodb://localhost/mydb'
	api:
        port: 9500
    route_modules: [
        { enable: true, name: 'auth',		class: 'AuthRoute', file: './routes/r_auth' }
        { enable: true, name: 'user',		class: 'User', 		file: './routes/r_user' }
        { enable: false, name: 'workout', 	class: 'Workout', 	file: './routes/r_workout' }
    ]
	prototype:
		enable: true
		modules: [
			{
			name: 'Todo', enable: false, auth_req: false, delta: ['Item']
			datasets:
				Item:
					title: 's128', completed:'n'
			}
			{
			name: 'League', enable: false, auth_req: false
			datasets:
				Team:
					name: 's128'
				Player:
					name: 's128', pos:'n', team_id:'key'
			}
		]
	route_prefix:
		assests: '/s'
		api: '/api/:Version'
		upload: '/upload'
