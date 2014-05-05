window.EpicMvc.issues$blueprint=
	User:
		default: [
			[ /APP_CREATED/, 'App Created Successfully']
			[ /APP_REMOVED/, 'App Removed Successfully']
			[ /FAILED_APP_REMOVAL/, 'Unable to Remove App: %1%']
			[ /IOS_SENT/, 'iOS Notification Sent Successfully']
			[ /ANDROID_SENT/, 'Android Notification Sent Successfully']
			[ /IOS_ERROR/, 'Error Sending iOS Notification: %1%']
			[ /ANDROID_ERROR/, 'Error Sending Android Notification: %1%']
			[ /ANDROID_CONFIGURED/, 'GCM Configured Successfully']
			[ /IOS_CONFIGURED/, 'APNs Configured Successfully']
			[ /NO_VALID_EMAILS/, 'No Valid Emails Registered']
		]
	default:
		default: [
			[ /BadRequest/, 'Invalid Parameters: %1%']
			[ /invalid_request/, 'Invalid Parameter (%2%): %1%']
			[ /not_found/, 'Resource Not Found: %1%']
			[ /UNCAUGHT_ERROR/, 'Unknown Error: %1%']
			[ /FORM_ERRORS/, 'There were errors on the form, see below.']
			[ /FIELD_EMPTY_TEXT/, '%3%']
			[ /FIELD_EMPTY/, '%2:1% is a required field.']
			[ /FIELD_ISSUE_TEXT/, '%3%']
			[ /FIELD_ISSUE/, '%2:1% is invalid.']
			[ /...._400_.*/, 'Invalid parameters (Error: 400).']
			[ /...._403_.*/, 'You do not have permissions to perform this operation (Error: 403).']
			[ /...._404_.*/, 'Associated record could not be found (Error: 404).']
			[ /...._500_.*/, 'General server error (Error: 500).']
			[ /...._001_.*/, 'Unknown server error (Error: 001).']
			[ /FALSE/, 'Unknown server error (Error: 901).']
			[ /.*/, 'Unknown server error (Error: 900).']
		]