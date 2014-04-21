#
# Workout Routes
#
# Author: Jamie Hollowell
#
# 	kit dependencies:
#		db.[mysql,mongo]
#		wrapper
#		logger.log
#

Q= require 'q'
E= require '../lib/error'

odb= false # Mongo DB
sdb= false # MySql DB


class Workout
	constructor: (kit)->
		kit.logger.log.info 'Initializing Workout Routes...'
		odb= kit.db.mongo
		sdb= kit.db.mysql
		@caller=
			get:
				use: true, wrap: 'read_wrap', version: any: @_get
				auth_required: true
			create:
				use: true, wrap: 'update_wrap', version: any: @_create
				auth_required: true

	# Private Logic
	_get: (conn, p, pre_loaded, _log)->
		use_docs= {}
		return use_docs if conn is 'use'

		f= 'Workout:_get:'
		_log.debug f, p

		Q.resolve()
		.then ->

			odb.mcore.find odb.Workout, {}
		.then (docs)->
			send: workouts: docs

	_create: (conn, p, pre_loaded, _log)->
		use_docs= description: 'rS', workout_name: 'rS', type: 'rE:good,bad'
		return use_docs if conn is 'use'

		f= 'Workout:_create:'
		newWorkout= false
		opts= name: p.workout_name, description: p.description, type: p.type

		throw new E.MissingArg 'description' if not p.description
		throw new E.MissingArg 'workout_name' if not p.workout_name
		throw new E.MissingArg 'type' if not p.type

		Q.resolve()
		.then ->

			# Search for an Existing Workout
			odb.Workout.FindByName p.workout_name
		.then (docs)->
			_log.debug 'got docs:', docs
			if docs.length > 0
				throw new E.AccessDenied 'Name already exists', name: p.workout_name

			newWorkout= new odb.Workout opts
			_log.debug 'typeName:', newWorkout.typeName
			newWorkout.FindSimilarTypes()
		.then (docs)->
			_log.debug 'got similar Types:', docs

			# Create new Workout
			odb.mcore.create odb.Workout, opts
		.then ->
			send: success: true, message: 'Workout created with name:' + newWorkout.name

exports.Workout= Workout







