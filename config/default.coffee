#
#	Default Config File
#

module.exports=
	ses:
		accessKeyId: 	'AKIAI5FIAQV7AJEQOH3Q'
		secretAccessKey: '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'
		region: 'us-west-2'
		debug_email: 'Blueprint Debug ToAddress <jamie.hollowell@dv-mobile.com>' # Make False to send to actual email address
		default:
			BccAddresses: []
			CcAddresses: []
			Source: 'Blueprint Default Source <jamie.hollowell@dv-mobile.com>'
			ReplyToAddresses: []
			ReturnPath: 'jamie.hollowell@dv-mobile.com' # The email address to which bounce notifications are to be forwarded.
		emails:
			forgot_password:
				model: 'User', tmpl: 'Top', page: 'forgot_password'
				Subject: 'Did you forget your password?'
				Text: 'You have forgotten your password huh? Well, That sucks.'
			verify_email_change:
				model: 'User', tmpl: 'Top', page: 'verify_email_change'
				Subject: 'Please Verify Your Email Address'
				Text: 'Please click on the following link'
			email_change_confirmed:
				model: 'User', tmpl: 'Top', page: 'confirm_email_change'
				Subject: 'Your email address has been successfully verified.'
				Text: 'Thank you for verifying your new email address.'
			verify_signup:
				model: 'Signup', tmpl: 'Top', page: 'verify_signup'
				Subject: 'Please Verify Signup.'
				Text: 'Thank yor for signing up with us! Please click the link below'
			signup_complete:
				model: 'Signup', tmpl: 'Top', page: 'signup_complete'
				Subject: 'Signup Complete!'
				Text: 'Thank yor for signing up with us! Your email address has been verified and your account has been activated!'
	log:
		name: 'blueprint'
		level: 'debug'
	auth:
		key : 'jQ9PhcT3Xz'
		bearer: 'blueprint'
		refreshTokenExpiration: 30 * 24 * 60 * 60 # seconds (30 Days)
		accessTokenExpiration: 10 * 60 # seconds (10 Minutes)
	db:
		mysql:
			enable: false
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
		ident_id: 98	# When the API needs to do something that requires an ident_id
		static_file_server:
			directory: './html_root'
			default: 'index.html'
	route_modules: [
        { enable: false, name: 'auth',		class: 'AuthRoute', 	file: './routes/r_auth' }
        { enable: false, name: 'user',		class: 'User', 			file: './routes/r_user' }
        { enable: false, name: 'workout', 	class: 'Workout', 		file: './routes/r_workout' }
        { enable: false, name: 'register', 	class: 'Registration', 	file: './routes/r_registration' }
    ]
    template: view_path: 'views/email'
    template_use: view_path: 'views/use'
    prototype:
    	enable: true
		modules: [
			{
			name: 'Todo', enable: true, auth_req: false, delta: ['Item']
			datasets:
				Item:
					title: 's128', completed:'n'
				Categories:
					label: 's128'
			}
			{
			name: 'League', enable: true, auth_req: false
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
