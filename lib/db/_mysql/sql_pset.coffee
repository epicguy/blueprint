#
#	User Database Functions
#
#	A User is the join between the ident table and the profile table.
#

Q= require 'q'
E= require '../../error'


class SqlPSet
	constructor: (@db, @log)->
		@table= 'pset'
		@schema=
			create: ['name']
			get_by_id: ['*']
		@db.method_factory @, 'SqlPush'

	get_by_name: (ctx, name)->
		f= "DB:SqlPushSet:get_collection:"
		@log.debug f, name

		Q.resolve()
		.then =>

			sql= 'SELECT * FROM ' + @table + ' WHERE name= ? AND di= 0'
			@db.sqlQuery ctx, sql, [name]
		.then (db_rows)->
			db_rows

	read_or_insert: (ctx, name)->
		f= "DB:SqlPushSet:read_or_insert:"
		@log.debug f, name
		existing_pset= false
		return name

		Q.resolve()
		.then =>

			# Look for existing PSet
			@get_by_name ctx, name
		.then (db_rows)->
			if db_rows.legnth
				existing_pset= db_rows[0]

			# Create new PSet if one doesn't exist
			return false if existing_pset
			@create ctx, name: name
		.then (db_result)->
			return false if db_result is false
			id= db_result.insertId

			# Re-Read the PSet to get the full record
			@get_by_id ctx, id
		.then (db_rows)->
			if db_rows isnt false
				throw new E.DbError 'DB:PUSHSET:REREAD' if db_rows.length isnt 1
				existing_pset= db_rows[0]

			existing_pset

exports.SqlPSet= SqlPSet