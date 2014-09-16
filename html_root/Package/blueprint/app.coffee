
window.EpicMvc.app$blueprint=
	OPTIONS:
		login: 		flow: 'anon'
		template:	default: 'logged_out'
		settings:	group: 'blueprint', show_issues: 'inline'
	MODELS:
		User:		class: 'User',		inst: 'bpU', forms:'Login'
	MACROS:
		start: call: 'User/check', RESULTS: [
			{ r:{valid:'yes'}, call: 'Pageflow/path', p:{path:'logged_in//'} }
		]
	CLICKS:
		Xbrowser_hash: call: "User/parse_hash", use_fields: "hash", RESULTS: [
			{ r:{page:'app'},  call:'User/url_landing_context', use_result: 'code:context', RESULTS: [
				{ r:{},   call: 'User/check', RESULTS: [
					{ r:{valid:'yes'}, call: 'Pageflow/path', p:{path:'logged_in/home/app_detail'} }
				] } # Standard landing page logic
			] }
			{ r:{},   macro: 'start' } # Default
		]
		logout: call: 'User/logout', RESULTS: [
			r:{}, call:'Pageflow/path', p:{path:'anon//'}
		]
	FLOWS:
		anon:
			start: 'login'
			TRACKS:
				login:
					start: 'login'
					STEPS:
						login: page: 'login', CLICKS:
							login: call: 'Pageflow/path', p: { path:'logged_in/home/dashboard' }
							#login: call: 'User/login', use_form: 'Login', RESULTS: [
							#	r:{success:'SUCCESS'}, call: 'Pageflow/path', p:{path: 'logged_in'} ]
		logged_in:
			start: 'home'
			template: 'logged_in'
			TRACKS:
				home:
					start:'dashboard'
					CLICKS:
						logout: call: 'Pageflow/path', p: { path:'anon/login/login' }
						go_dashboard: call: 'Pageflow/path', p: { path:'//dashboard' }
						go_flot: call: 'Pageflow/path', p: { path:'//flot' }
						go_morris: call: 'Pageflow/path', p: { path:'//morris' }
						go_tables: call: 'Pageflow/path', p: { path:'//tables' }
						go_forms: call: 'Pageflow/path', p: { path:'//forms' }
						go_buttons: call: 'Pageflow/path', p: { path:'//buttons' }
						go_panels_wells: call: 'Pageflow/path', p: { path:'//panels_wells' }
						go_notifications: call: 'Pageflow/path', p: { path:'//notifications' }
						go_typography: call: 'Pageflow/path', p: { path:'//typography' }
						go_grid: call: 'Pageflow/path', p: { path:'//grid' }
						go_blank: call: 'Pageflow/path', p: { path:'//blank' }
					STEPS:
						dashboard:	page:'dashboard'
						flot:	page:'flot', v: {chart: true }
						morris: page: 'morris', v: {chart: true }
						tables: page: 'tables'
						forms: page: 'forms'
						buttons: page: 'buttons', v: {ui_element: true }
						panels_wells: page: 'panels_wells', v: {ui_element: true }
						notifications: page: 'notifications', v: {ui_element: true }
						typography: page: 'typography', v: {ui_element: true }
						grid: page: 'grid', v: {ui_element: true }
						blank: page: 'blank', v: {sample_page: true }


