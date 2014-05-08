class Todo extends window.EpicMvc.ModelJS
	constructor: (Epic,view_nm) ->
		ss =
			show_state: 'all'
			active_item_id: false
		super Epic, view_nm, ss
		@rest= rest_v1
	action: (act,p) ->
		f= "Todo:action:#{act}"
		_log1 f, p
		r= {}
		i= new window.EpicMvc.Issue @Epic, @view_nm, act
		m= new window.EpicMvc.Issue @Epic, @view_nm, act
		switch act
			when "show" # p.state= (all|active|completed)
				@show_state= p.state
				@invalidateTables true
			when "choose_item" # p.input_obj, p.clear
				if p.clear is true
					@active_item_id= false
				else
					el= $(p.input_obj)
					id= el.attr("data-p-id")
					@active_item_id= (Number id)
				@invalidateTables true
			when "save_todo" # p.input_obj
				el= $(p.input_obj)
				id= el.attr("data-p-id")
				title= el.val()
				if id?
					data= title: title
					results= rest_v1.call 'POST', "Prototype/Todo/Item/#{id}/update", f, data
					_log2 f, 'got update results:', results
					if results.success
						for item in @c_items when item.id is (Number id)
							item[nm]= val for nm, val of results.Item[0]
							break
				else
					data= title: title, completed: ''
					results= rest_v1.call 'POST', 'Prototype/Todo/Item', f, data
					_log2 f, 'got create results:', results
					new_item= results.Item[0]
					@c_items.push new_item
				@invalidateTables true
			when "delete_todo" # p.id
				_log2 f, 'items before:', @c_items
				results= rest_v1.call 'POST', "Prototype/Todo/Item/#{p.id}/delete", f
				_log2 f, 'got delete results:', results
				if results.success is true
					@c_items= false
				@invalidateTables true
			when "clear_completed"
				batch_ids= (item.id for item in @c_items when item.completed is 'yes')
				data= batch_ids: batch_ids
				results= rest_v1.call 'POST', "Prototype/Todo/Item/batch/delete", f, data
				_log2 f, 'got delete results:', results
				if results.success is true
					@c_items= false
				@invalidateTables true
			when "mark_toggle" # p.input_obj, data-p-id
				el= $(p.input_obj)
				id= el.attr("data-p-id")
				for item in @c_items when item.id is (Number id)
					data= completed: if item.completed is 'yes' then '' else 'yes'
					results= rest_v1.call 'POST', "Prototype/Todo/Item/#{id}/update", f, data
					_log2 f, 'got mark toggle results:', results
					if results.success
						item[nm]= val for nm, val of results.Item[0]
					break
				@invalidateTables true
			when "mark_all"
				batch_ids= (item.id for item in @c_items when item.completed isnt 'yes')
				data= { completed: 'yes', batch_ids }
				results= rest_v1.call 'POST', "Prototype/Todo/Item/batch/update", f, data
				_log2 f, 'got mark all results:', results
				if results.success is true
					@c_items= false
				@invalidateTables true
			else return super act, p
		[r,i,m]
	loadTable: (tbl_nm) ->
		f= "loadTable:#{tbl_nm}"
		item_list= @_getTodos()
		switch tbl_nm
			when 'Options'
				c= 0; nc= 0
				for item in item_list
					if item.completed is 'yes' then c++ else nc++
				row=
					show_all: if @show_state is 'all' then 'yes' else ''
					show_completed: if @show_state is 'completed' then 'yes' else ''
					show_active: if @show_state is 'active' then 'yes' else ''
					not_completed_count: nc
					completed_count: c
					count: item_list.length
				@Table[tbl_nm]= [row]
			when 'Item'
				switch @show_state
					when 'all'
						rows= item_list
					when 'active'
						rows= (item for item in item_list when item.completed isnt 'yes')
					when 'completed'
						rows= (item for item in item_list when item.completed is 'yes')
				for row in rows
					row.is_editing= if row.id is @active_item_id then 'yes' else ''
				@Table[tbl_nm]= rows
			else return super tbl_nm
	fistLoadData: (oFist) ->
		switch oFist.getFistNm()
			when 'Login' then null
			else return super oFist
	fistGetFieldChoices: (oFist,field_nm) ->
		switch field_nm
			when 'DevPull' then options: [ 'Development', 'Production' ], values: [ 'yes', 'no' ]
			else return super oFist, field_nm
	_getTodos: ()->
		f= 'Todo._getTodos:'
		return @c_items if @c_items
		results= rest_v1.call 'GET', 'Prototype/Todo/Item', f
		if results.success
			@c_items= results.Item
		else
			@c_items= []
window.EpicMvc.Model.Todo= Todo # Public API