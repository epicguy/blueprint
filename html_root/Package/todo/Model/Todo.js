// Generated by CoffeeScript 1.4.0
(function() {
  var Todo,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo = (function(_super) {

    __extends(Todo, _super);

    function Todo(Epic, view_nm) {
      var ss,
        _this = this;
      ss = {
        show_state: 'all',
        active_item_id: false
      };
      Todo.__super__.constructor.call(this, Epic, view_nm, ss);
      this.rest = rest_v1;
      this.socket = window.EpicMvc.Extras.io.connect('http://localhost:9500/push');
      this.socket.on('connected', function() {
        return console.log('Connected to Socket Server!');
      });
      this.socket.on('update', function(data) {
        var rec, _i, _len, _ref;
        console.log('got socket update:', data);
        _ref = data.changes['Item'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rec = _ref[_i];
          switch (rec.verb) {
            case 'add':
              _this.c_items_idx[rec.id] = rec.after;
              break;
            case 'update':
              $.extend(_this.c_items_idx[rec.id], rec.after);
              break;
            case 'delete':
              delete _this.c_items_idx[rec.id];
          }
        }
        _this.c_items = false;
        return _this.invalidateTables(true);
      });
    }

    Todo.prototype.action = function(act, p) {
      var batch_ids, data, el, f, i, id, item, m, new_item, r, results, title, _i, _j, _len, _len1;
      f = "Todo:action:" + act;
      _log1(f, p);
      r = {};
      i = new window.EpicMvc.Issue(this.Epic, this.view_nm, act);
      m = new window.EpicMvc.Issue(this.Epic, this.view_nm, act);
      switch (act) {
        case "show":
          this.show_state = p.state;
          this.invalidateTables(true);
          break;
        case "choose_item":
          if (p.clear === true) {
            this.active_item_id = false;
          } else {
            el = $(p.input_obj);
            id = el.attr("data-p-id");
            this.active_item_id = Number(id);
          }
          this.invalidateTables(true);
          break;
        case "save_todo":
          el = $(p.input_obj);
          id = el.attr("data-p-id");
          title = el.val();
          if (id != null) {
            data = {
              title: title
            };
            results = rest_v1.call('POST', "Prototype/Todo/Item/" + id + "/update", f, data);
            _log2(f, 'got update results:', results);
            if (results.success) {
              $.extend(this.c_items_idx[id], results.Item[0]);
            }
          } else {
            data = {
              title: title,
              completed: ''
            };
            results = rest_v1.call('POST', 'Prototype/Todo/Item', f, data);
            _log2(f, 'got create results:', results);
            new_item = results.Item[0];
            this.c_items_idx[new_item.id] = new_item;
          }
          this.c_items = false;
          this.invalidateTables(true);
          break;
        case "delete_todo":
          _log2(f, 'items before:', this.c_items);
          results = rest_v1.call('POST', "Prototype/Todo/Item/" + p.id + "/delete", f);
          _log2(f, 'got delete results:', results);
          if (results.success === true) {
            delete this.c_items_idx[p.id];
            this.c_items = false;
          }
          this.invalidateTables(true);
          break;
        case "clear_completed":
          batch_ids = (function() {
            var _i, _len, _ref, _results;
            _ref = this.c_items;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              if (item.completed === 'yes') {
                _results.push(item.id);
              }
            }
            return _results;
          }).call(this);
          data = {
            batch_ids: batch_ids
          };
          results = rest_v1.call('POST', "Prototype/Todo/Item/batch/delete", f, data);
          _log2(f, 'got delete results:', results);
          if (results.success === true) {
            for (_i = 0, _len = batch_ids.length; _i < _len; _i++) {
              id = batch_ids[_i];
              delete this.c_items_idx[id];
            }
            this.c_items = false;
          }
          this.invalidateTables(true);
          break;
        case "mark_toggle":
          el = $(p.input_obj);
          id = el.attr("data-p-id");
          data = {
            completed: this.c_items_idx[id].completed === 'yes' ? '' : 'yes'
          };
          results = rest_v1.call('POST', "Prototype/Todo/Item/" + id + "/update", f, data);
          if (results.success) {
            $.extend(this.c_items_idx[id], results.Item[0]);
            this.c_items = false;
          }
          this.invalidateTables(true);
          break;
        case "mark_all":
          batch_ids = (function() {
            var _j, _len1, _ref, _results;
            _ref = this.c_items;
            _results = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              item = _ref[_j];
              if (item.completed !== 'yes') {
                _results.push(item.id);
              }
            }
            return _results;
          }).call(this);
          data = {
            completed: 'yes',
            batch_ids: batch_ids
          };
          results = rest_v1.call('POST', "Prototype/Todo/Item/batch/update", f, data);
          _log2(f, 'got mark all results:', results);
          if (results.success === true) {
            for (_j = 0, _len1 = batch_ids.length; _j < _len1; _j++) {
              id = batch_ids[_j];
              $.extend(this.c_items_idx[id], {
                completed: 'yes'
              });
            }
            this.c_items = false;
          }
          this.invalidateTables(true);
          break;
        default:
          return Todo.__super__.action.call(this, act, p);
      }
      return [r, i, m];
    };

    Todo.prototype.loadTable = function(tbl_nm) {
      var c, f, item, item_list, nc, row, rows, _i, _j, _len, _len1;
      f = "loadTable:" + tbl_nm;
      _log2(f);
      item_list = this._getTodos();
      switch (tbl_nm) {
        case 'Options':
          c = 0;
          nc = 0;
          for (_i = 0, _len = item_list.length; _i < _len; _i++) {
            item = item_list[_i];
            if (item.completed === 'yes') {
              c++;
            } else {
              nc++;
            }
          }
          row = {
            show_all: this.show_state === 'all' ? 'yes' : '',
            show_completed: this.show_state === 'completed' ? 'yes' : '',
            show_active: this.show_state === 'active' ? 'yes' : '',
            not_completed_count: nc,
            completed_count: c,
            count: item_list.length
          };
          return this.Table[tbl_nm] = [row];
        case 'Item':
          switch (this.show_state) {
            case 'all':
              rows = item_list;
              break;
            case 'active':
              rows = (function() {
                var _j, _len1, _results;
                _results = [];
                for (_j = 0, _len1 = item_list.length; _j < _len1; _j++) {
                  item = item_list[_j];
                  if (item.completed !== 'yes') {
                    _results.push(item);
                  }
                }
                return _results;
              })();
              break;
            case 'completed':
              rows = (function() {
                var _j, _len1, _results;
                _results = [];
                for (_j = 0, _len1 = item_list.length; _j < _len1; _j++) {
                  item = item_list[_j];
                  if (item.completed === 'yes') {
                    _results.push(item);
                  }
                }
                return _results;
              })();
          }
          for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
            row = rows[_j];
            row.is_editing = row.id === this.active_item_id ? 'yes' : '';
          }
          return this.Table[tbl_nm] = rows;
        default:
          return Todo.__super__.loadTable.call(this, tbl_nm);
      }
    };

    Todo.prototype.fistLoadData = function(oFist) {
      switch (oFist.getFistNm()) {
        case 'Login':
          return null;
        default:
          return Todo.__super__.fistLoadData.call(this, oFist);
      }
    };

    Todo.prototype.fistGetFieldChoices = function(oFist, field_nm) {
      switch (field_nm) {
        case 'DevPull':
          return {
            options: ['Development', 'Production'],
            values: ['yes', 'no']
          };
        default:
          return Todo.__super__.fistGetFieldChoices.call(this, oFist, field_nm);
      }
    };

    Todo.prototype._getTodos = function() {
      var f, idx, item, results, _i, _len, _ref;
      f = 'Todo._getTodos:';
      if (this.c_items_idx) {
        this.c_items = (function() {
          var _ref, _results;
          _ref = this.c_items_idx;
          _results = [];
          for (idx in _ref) {
            item = _ref[idx];
            _results.push(item);
          }
          return _results;
        }).call(this);
      }
      if (this.c_items) {
        return this.c_items;
      }
      results = rest_v1.call('GET', 'Prototype/Todo', f);
      if (results.success) {
        this.c_items = results.Item;
        this.c_items_idx = {};
        _ref = results.Item;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          this.c_items_idx[item.id] = item;
        }
        this.socket.emit('listen', results.push);
      } else {
        this.c_items = [];
      }
      return this.c_items;
    };

    return Todo;

  })(window.EpicMvc.ModelJS);

  window.EpicMvc.Model.Todo = Todo;

}).call(this);
