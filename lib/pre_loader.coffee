#
#	Route Pre-Loader
#
#	kit dependencies:
#		db.mysql
#		logger.log.[debug,info]

Q= require 'q'

class PreLoader
	constructor: (kit) ->
		kit.logger.log.info 'Initializing Pre-Loader...'
		@db= kit.db
		@log= kit.logger.log

	load_user: (conn, usid)->
		@log.debug 'PreLoader:load_user:', usid
		Q.resolve().then =>

			sql= 'SELECT * FROM t1_users WHERE id= ? AND disposal= 0'
			@db.mysql.core.sqlQuery conn, sql, [usid]
		.then (db_rows) ->
			return false if db_rows.length is 0
			db_rows[0]

exports.PreLoader= PreLoader