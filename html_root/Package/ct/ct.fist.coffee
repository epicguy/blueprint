window.EpicMvc.fist$ct=
	FIELDS:
		AuthEmail: { db_nm:'eml', type:'email',    req:true, h2h:'trim_spaces', label:'Email' }
		LoginPass: { db_nm:'pwd', type:'password', req:true, h2h:'trim_spaces', label:'Password' }

	FISTS:

		Login: [ 'AuthEmail', 'LoginPass' ]

