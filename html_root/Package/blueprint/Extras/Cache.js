// Generated by CoffeeScript 1.4.0
var Cache,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Cache = (function() {

  function Cache() {
    this.C_handleDelta = __bind(this.C_handleDelta, this);

    this.C_handlePoll = __bind(this.C_handlePoll, this);

    this.C_handleRest = __bind(this.C_handleRest, this);
    this.c_dataset = {};
    this.allowed = {
      Todo: {
        endpoint: 'Prototype/Todo',
        handler: this.C_handleDelta,
        data_nm: 'Todo',
        handle: 'todo',
        sync: true,
        auth_req: false
      }
    };
    this.rest = window.rest_v1;
    this.poller = new window.EpicMvc.Extras.Poll(this.rest.GetPrefix(), this.C_handlePoll);
    this.self_id = false;
  }

  Cache.prototype.LogoutEvent = function() {
    var f;
    f = 'Cache:LogoutEvent:';
    _log2(f);
    this.poller.Stop();
    this.c_dataset = {};
    return this.self_id = false;
  };

  Cache.prototype.S_MakeDataset = function(resource, params) {
    var dataset, endpoint, f, nm, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
    f = 'Cache:S_MakeDataset:' + resource;
    dataset = this.allowed[resource].handle;
    _ref1 = (_ref = this.allowed[resource].params) != null ? _ref : [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      nm = _ref1[_i];
      if (!(nm in params)) {
        BROKEN();
      }
      dataset = dataset.replace(":" + nm + ":", params[nm]);
    }
    if (dataset in this.c_dataset) {
      return dataset;
    }
    endpoint = this.allowed[resource].endpoint;
    _ref3 = (_ref2 = this.allowed[resource].params) != null ? _ref2 : [];
    for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
      nm = _ref3[_j];
      endpoint = endpoint.replace(":" + nm + ":", params[nm]);
    }
    this.c_dataset[dataset] = {
      resource: resource,
      endpoint: endpoint,
      cb: []
    };
    _log2(f, params, this.c_dataset[dataset]);
    return dataset;
  };

  Cache.prototype.GetResource = function(resource, params, cb) {
    var data_or_true, dataset, f, rval;
    f = 'Cache:GetResource:';
    _log2(f, resource);
    rval = false;
    if (!(resource in this.allowed)) {
      BROKEN();
    }
    dataset = this.S_MakeDataset(resource, params);
    if (!('loading' in this.c_dataset[dataset])) {
      data_or_true = this.S_get(dataset);
      if (cb) {
        this.c_dataset[dataset].cb.push(cb);
      }
      rval = data_or_true;
    } else if (this.c_dataset[dataset].loading === true) {
      if (cb) {
        this.c_dataset[dataset].cb.push(cb);
      }
      rval = true;
    } else {
      rval = this.c_dataset[dataset].data;
    }
    return rval;
  };

  Cache.prototype.S_get = function(dataset) {
    var data, endpoint, f, resource, tactic,
      _this = this;
    f = 'Cache:S_get:' + dataset;
    _log2(f);
    this.c_dataset[dataset].loading = true;
    resource = this.c_dataset[dataset].resource;
    endpoint = this.c_dataset[dataset].endpoint;
    tactic = this.allowed[resource].auth_req === false ? 'NoAuthGet' : 'Get';
    if (this.allowed[resource].sync === true) {
      data = this.rest[tactic](endpoint, f, {});
      this.C_handleRest(dataset, data);
      return data;
    } else {
      setTimeout(function() {
        data = _this.rest[tactic](endpoint, f, {});
        return _this.C_handleRest(dataset, data);
      }, 1000);
      return true;
    }
  };

  Cache.prototype.C_handleRest = function(dataset, data) {
    var cb, f, main_r, resource, row, sub_r, _i, _j, _len, _len1, _ref, _ref1;
    f = 'Cache:C_handleRest:' + dataset;
    _log2(f, data);
    if (!(dataset in this.c_dataset)) {
      BROKEN_CACHED();
    }
    resource = this.c_dataset[dataset].resource;
    this.c_dataset[dataset].loading = false;
    this.c_dataset[dataset].data = data;
    if (resource === 'Self' && data.success === true) {
      this.self_id = data.user[0].id;
    }
    main_r = data[this.allowed[resource].data_nm];
    for (sub_r in main_r) {
      if ($.isArray(main_r[sub_r])) {
        main_r[sub_r + '_idx'] = {};
        _ref = main_r[sub_r];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          row = _ref[_i];
          main_r[sub_r + '_idx'][row.id] = row;
        }
      } else {
        main_r[sub_r + '_idx'] = {};
        main_r[sub_r + '_idx'][main_r[sub_r].id] = main_r[sub_r];
      }
    }
    if (this.allowed[resource].sync !== true) {
      _ref1 = this.c_dataset[dataset].cb;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        cb = _ref1[_j];
        cb(resource, data);
      }
    }
    if ('push_handle' in data) {
      return this.poller.Listen(dataset, data.push_handle);
    }
  };

  Cache.prototype.C_handlePoll = function(response) {
    var data, dataset, f, handle, resource, _ref;
    f = 'Cache:C_handlePoll:';
    _log2(f, response);
    _ref = response.sync;
    for (handle in _ref) {
      data = _ref[handle];
      dataset = handle;
      resource = this.c_dataset[dataset].resource;
      this.allowed[resource].handler(dataset, data);
    }
    return true;
  };

  Cache.prototype.C_handleDelta = function(dataset, new_data) {
    var cb, changes, data, f, id, main_r, rec, resource, self, sub_r, updateSelf, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
    f = 'Cache:C_handleDelta:';
    resource = this.c_dataset[dataset].resource;
    data = this.c_dataset[dataset].data;
    main_r = data[this.allowed[resource].data_nm];
    updateSelf = false;
    for (sub_r in new_data) {
      changes = new_data[sub_r];
      for (_i = 0, _len = changes.length; _i < _len; _i++) {
        rec = changes[_i];
        switch (rec.verb) {
          case 'add':
            main_r[sub_r + '_idx'][rec.id] = rec.after;
            break;
          case 'update':
            if (!updateSelf) {
              updateSelf = this.self_id && resource === 'Clinic' && sub_r === 'users' && rec.id === this.self_id;
            }
            _log2(f, {
              main_r: main_r,
              sub_r: sub_r,
              rec: rec
            });
            $.extend(main_r[sub_r + '_idx'][rec.id], rec.after);
            break;
          case 'delete':
            delete main_r[sub_r + '_idx'][rec.id];
        }
      }
      if ($.isArray(main_r[sub_r])) {
        main_r[sub_r] = (function() {
          var _ref, _results;
          _ref = main_r[sub_r + '_idx'];
          _results = [];
          for (id in _ref) {
            rec = _ref[id];
            _results.push(rec);
          }
          return _results;
        })();
      } else {
        main_r[sub_r] = main_r[sub_r + '_idx'][main_r[sub_r].id];
      }
    }
    _ref = this.c_dataset[dataset].cb;
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      cb = _ref[_j];
      cb(resource, data);
    }
    if (updateSelf) {
      _ref1 = this.c_dataset[this.allowed.Self.data_nm].cb;
      _results = [];
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        cb = _ref1[_k];
        self = this.c_dataset.user.data.user[0];
        $.extend(self, data.clinic.users_idx[this.self_id]);
        _results.push(cb('Self', {
          user: [self]
        }));
      }
      return _results;
    }
  };

  return Cache;

})();

window.EpicMvc.Extras.Cache = Cache;
