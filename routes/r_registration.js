// Generated by CoffeeScript 1.9.2
(function() {
  var E, Q, Registration, _log, sdb,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Q = require('q');

  E = require('../lib/error');

  sdb = false;

  _log = false;

  Registration = (function() {
    function Registration(kit) {
      this._register_signup = bind(this._register_signup, this);
      this._read_signup = bind(this._read_signup, this);
      this._signup = bind(this._signup, this);
      _log = kit.services.logger.log;
      sdb = kit.services.db.mysql;
      this.ses = kit.services.ses;
      this.auth = kit.services.auth;
      this.config = kit.services.config;
      this.tripMgr = kit.services.tripMgr;
      this.template = kit.services.template;
      this.endpoints = {
        signup: {
          verb: 'post',
          route: '/Signup',
          sql_conn: true,
          sql_tx: true,
          auth_required: false,
          use: true,
          wrap: 'default_wrap',
          version: {
            any: this._signup
          }
        },
        read_signup: {
          verb: 'get',
          route: '/Signup/:token',
          use: true,
          wrap: 'default_wrap',
          version: {
            any: this._read_signup
          },
          sql_conn: true,
          auth_required: false
        },
        register_signup: {
          verb: 'post',
          route: '/Signup/:token/register',
          use: true,
          wrap: 'default_wrap',
          version: {
            any: this._register_signup
          },
          sql_conn: true,
          sql_tx: true,
          auth_required: false
        }
      };
    }

    Registration.prototype.make_tbl = function(recipient, token, options) {
      return {
        Trip: [
          {
            token: token
          }
        ],
        Recipient: [recipient],
        Opt: [options]
      };
    };

    Registration.prototype._signup = function(ctx, pre_loaded) {
      var f, p, recipient, success, use_doc;
      use_doc = {
        params: {
          fnm: 'r:S',
          lnm: 'r:S',
          eml: 'r:S'
        },
        response: {
          success: 'bool'
        }
      };
      if (ctx === 'use') {
        return use_doc;
      }
      _log = ctx.log;
      p = ctx.p;
      recipient = false;
      success = false;
      f = 'Registration:_signup:';
      if (!p.eml) {
        throw new E.MissingArg('eml');
      }
      if (!p.fnm) {
        throw new E.MissingArg('fnm');
      }
      if (!p.lnm) {
        throw new E.MissingArg('lnm');
      }
      return Q.resolve().then(function() {
        return sdb.auth.GetByCredName(ctx, p.eml);
      }).then((function(_this) {
        return function(db_rows) {
          _log.debug('got ident with eml:', db_rows);
          if (db_rows.length !== 0) {
            throw new E.AccessDenied('REGISTER:SIGNUP:EMAIL_EXISTS');
          }
          return _this.tripMgr.planTrip(ctx, _this.config.api.ident_id, {
            eml: p.eml,
            fnm: p.fnm,
            lnm: p.lnm
          }, null, 'signup');
        };
      })(this)).then((function(_this) {
        return function(new_trip) {
          var trip;
          _log.debug(f, 'got signup round trip:', new_trip);
          trip = new_trip;
          recipient = {
            email: p.eml,
            fnm: p.fnm,
            lnm: p.lnm
          };
          return _this.ses.send('verify_signup', _this.make_tbl(recipient, trip.token, _this.config.ses.options));
        };
      })(this)).then(function() {
        success = true;
        return {
          send: {
            success: success,
            recipient: recipient
          }
        };
      });
    };

    Registration.prototype._read_signup = function(ctx, pre_loaded) {
      var f, p, success, trip, use_doc;
      use_doc = {
        params: {},
        response: {
          success: 'bool',
          signup: 'JSON'
        }
      };
      if (ctx === 'use') {
        return use_doc;
      }
      _log = ctx.log;
      p = ctx.p;
      trip = false;
      success = false;
      f = 'Registration:_read_signup:';
      return Q.resolve().then((function(_this) {
        return function() {
          return _this.tripMgr.getTripFromToken(ctx, p.token);
        };
      })(this)).then((function(_this) {
        return function(trip_info) {
          var bad_token;
          _log.debug(f, 'got round trip:', trip_info);
          trip = trip_info;
          bad_token = trip_info.status === 'unknown' || trip_info.status !== 'valid';
          if (bad_token) {
            throw new E.AccessDenied('REGISTER:READ_SIGNUP:BAD_TOKEN');
          }
          trip.json = JSON.parse(trip.json);
          return sdb.auth.GetByCredName(ctx, trip.json.eml);
        };
      })(this)).then((function(_this) {
        return function(db_rows) {
          _log.debug('got ident with eml:', db_rows);
          if (db_rows.length !== 0) {
            throw new E.AccessDenied('REGISTER:READ_SIGNUP:EMAIL_EXISTS');
          }
          success = true;
          return {
            send: {
              success: success,
              signup: trip.json
            }
          };
        };
      })(this));
    };

    Registration.prototype._register_signup = function(ctx, pre_loaded) {
      var change_trip, eml, eml_change, f, new_ident_id, new_pwd, p, success, trip, use_doc;
      use_doc = {
        params: {
          fnm: 'r:S',
          lnm: 'r:S',
          eml: 'r:S',
          pwd: 'r:S'
        },
        response: {
          success: 'bool',
          eml_change: 'bool'
        }
      };
      if (ctx === 'use') {
        return use_doc;
      }
      f = 'Registration:_register_signup:';
      _log = ctx.log;
      p = ctx.p;
      trip = false;
      change_trip = false;
      eml = p.eml;
      eml_change = false;
      new_ident_id = false;
      new_pwd = '';
      success = false;
      if (!p.eml) {
        throw new E.MissingArg('eml');
      }
      if (!p.pwd) {
        throw new E.MissingArg('pwd');
      }
      if (!p.fnm) {
        throw new E.MissingArg('fnm');
      }
      if (!p.lnm) {
        throw new E.MissingArg('lnm');
      }
      return Q.resolve().then((function(_this) {
        return function() {
          return _this.tripMgr.getTripFromToken(ctx, p.token);
        };
      })(this)).then((function(_this) {
        return function(trip_info) {
          var bad_token;
          _log.debug(f, 'got round trip:', trip_info);
          trip = trip_info;
          bad_token = trip_info.status === 'unknown' || trip_info.status !== 'valid';
          if (bad_token) {
            throw new E.AccessDenied('REGISTER:REGISTER_SIGNUP:BAD_TOKEN');
          }
          trip.json = JSON.parse(trip.json);
          eml_change = eml !== trip.json.eml;
          return sdb.auth.GetByCredName(ctx, eml);
        };
      })(this)).then((function(_this) {
        return function(db_rows) {
          _log.debug(f, 'got ident with eml:', db_rows);
          if (db_rows.length !== 0) {
            throw new E.AccessDenied('REGISTER:REGISTER_SIGNUP:EMAIL_EXISTS');
          }
          success = true;
          return _this.auth.EncryptPassword(p.pwd);
        };
      })(this)).then((function(_this) {
        return function(pwd_hash) {
          var new_ident;
          new_pwd = pwd_hash;
          new_ident = {
            eml: trip.json.eml,
            pwd: new_pwd
          };
          return sdb.auth.Create(ctx, new_ident);
        };
      })(this)).then((function(_this) {
        return function(db_result) {
          var new_profile;
          if (db_result.affectedRows !== 1) {
            throw new E.DbError('REGISTER:REGISTER_SIGNUP:CREATE_IDENT');
          }
          new_ident_id = db_result.insertId;
          new_profile = {
            ident_id: new_ident_id,
            fnm: p.fnm,
            lnm: p.lnm
          };
          return sdb.user.Create(ctx, new_profile);
        };
      })(this)).then((function(_this) {
        return function(db_result) {
          if (db_result.affectedRows !== 1) {
            throw new E.DbError('REGISTER:REGISTER_SIGNUP:CREATE_PROFILE');
          }
          return _this.tripMgr.returnFromTrip(ctx, trip.id, new_ident_id);
        };
      })(this)).then((function(_this) {
        return function() {
          var recipient;
          if (eml_change) {
            return false;
          }
          recipient = {
            email: p.eml,
            fnm: p.fnm,
            lnm: p.lnm
          };
          return _this.ses.send('signup_complete', _this.make_tbl(recipient));
        };
      })(this)).then((function(_this) {
        return function() {
          if (!eml_change) {
            return false;
          }
          return _this.tripMgr.planTrip(ctx, new_ident_id, {
            eml: eml
          }, null, 'update_email');
        };
      })(this)).then((function(_this) {
        return function(new_trip) {
          var recipient;
          _log.debug(f, 'got round trip:', new_trip);
          if (new_trip !== false) {
            change_trip = new_trip;
          }
          if (!eml_change) {
            return false;
          }
          recipient = {
            email: eml
          };
          return _this.ses.send('verify_email_change', _this.make_tbl(recipient, change_trip.token));
        };
      })(this)).then(function() {
        success = true;
        return {
          send: {
            success: success,
            eml_change: eml_change
          }
        };
      });
    };

    return Registration;

  })();

  exports.Registration = Registration;

}).call(this);
