window.EpicMvc.fist$blueprint=
	FIELDS:
		Msg:        		{ db_nm:'message', 		type:'textarea',  		req:true, h2h:'trim_spaces', label: 'Message to send'}
		Emails:        		{ db_nm:'emails', 		type:'textarea',  		req:true, h2h:'trim_spaces', label: 'Emails in JSON Array'}
		PlatPull:   		{ db_nm:'platform', type:'pulldown:custom', req:true, label: 'Platform'}
		AppKeyPull:  		{ db_nm:'app_key',  type:'pulldown:custom', req:true, label: 'Environment'}
		VersionPull:  		{ db_nm:'version',  type:'pulldown:custom', req:true, label: 'Version'}

		ApiKey:		{ db_nm: 'goog_api_key', type:'text', req:true, h2h:'trim_spaces', label: 'API Key'}

		Cert:		{ db_nm: 'cert', type:'file_source', req:true, label: 'Please Upload File Titled "cert.pem"', custom_name: 'cert.pem', req_text:'Customer Error Message!'}
		Key:		{ db_nm: 'key', type:'file_source', req:true, label: 'Please Upload File Title "key.pem"', custom_name: 'key.pem'}

		AppName:	{ db_nm: 'name', type:'text', req:true, h2h:'trim_spaces', label: 'My Next Blockbuster App'}
		DevPull:   { db_nm:'dev',   type:'pulldown:custom', req:true, label: 'Environment'}

		AuthEmail: { db_nm:'email',    type:'email',     req:true, h2h:'trim_spaces', label:'Email' }
		LoginPass: { db_nm:'password', type:'password', req:true, h2h:'trim_spaces', label:'Password' }

	FISTS:

		Login: [ 'AuthEmail', 'LoginPass' ]
		SendGeneral: ['Msg', 'PlatPull', 'AppKeyPull', 'VersionPull']
		SendTarget: ['Msg', 'Emails', 'AppKeyPull']
		ConfigAndroid: ['ApiKey', 'DevPull']
		ConfigiOS: [ 'Cert', 'Key', 'DevPull']
		CreateApp: [ 'AppName']
