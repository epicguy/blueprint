// Generated by CoffeeScript 1.6.3
(function() {
  var E, Q, User, extnd_tbl, ident_tbl, odb, sdb, _log,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Q = require('q');

  E = require('../lib/error');

  odb = false;

  sdb = false;

  _log = false;

  ident_tbl = 'ident';

  extnd_tbl = 'profile';

  User = (function() {
    function User(kit) {
      kit.logger.log.info('Initializing User Routes...');
      odb = kit.db.mongo;
      sdb = kit.db.mysql;
      _log = kit.logger.log;
      this.caller = {
        view_profile: {
          use: true,
          wrap: 'read_wrap',
          version: {
            any: this._view_profile
          },
          sql_conn: true,
          auth_required: true,
          pre_load: {
            user: this._pl_user
          }
        },
        update_profile: {
          use: true,
          wrap: 'update_wrap',
          version: {
            any: this._update_profile
          },
          sql_conn: true,
          auth_required: true,
          pre_load: {
            user: this._pl_user
          }
        }
      };
    }

    User.prototype._view_profile = function(conn, p, pre_loaded, _log) {
      var f, use_doc;
      use_doc = {};
      if (conn === 'use') {
        return use_doc;
      }
      f = 'User:_get:';
      return Q.resolve().then(function() {
        return {
          send: {
            success: true,
            users: [pre_loaded.user]
          }
        };
      });
    };

    User.prototype._update_profile = function(conn, p, pre_loaded, _log) {
      var f, new_user_values, nm, updatable_fields, use_doc, val;
      use_doc = {
        fnm: 'S',
        lnm: 'S',
        website: 'S',
        avatar_path: 'S',
        avatar_thumb: 'S',
        prog_lang: 'S',
        skill_lvl: 'S'
      };
      if (conn === 'use') {
        return use_doc;
      }
      if (pre_loaded.auth_id !== pre_loaded.user.id) {
        throw new E.AccessDenied('USER:UPDATE_PROFILE:AUTH_ID');
      }
      f = 'User:_update_profile:';
      updatable_fields = ['fnm', 'lnm', 'website', 'avatar_path', 'avatar_thumb', 'prog_lang', 'skill_lvl'];
      new_user_values = {};
      for (nm in p) {
        val = p[nm];
        if (__indexOf.call(updatable_fields, nm) >= 0) {
          new_user_values[nm] = val;
        }
      }
      return Q.resolve().then(function() {
        _log.debug(f, new_user_values);
        return sdb.user.update_by_ident_id(conn, pre_loaded.user.id, new_user_values);
      }).then(function(db_result) {
        _log.debug(f, 'got profile update result:', db_result);
        if (db_result.affectedRows !== 1) {
          throw new E.DbError('User Update Failed');
        }
        new_user_values.id = pre_loaded.user.id;
        return {
          send: {
            success: true,
            updated_user: new_user_values
          }
        };
      });
    };

    User.prototype._pl_user = function(conn, p) {
      var f;
      f = 'User:_pl_user:';
      _log.debug(f, p);
      return Q.resolve().then(function() {
        return sdb.user.get_by_ident_id(conn, p.usid);
      }).then(function(db_rows) {
        if (db_rows.length !== 1) {
          throw new E.NotFoundError('User');
        }
        return db_rows[0];
      });
    };

    return User;

  })();

  exports.User = User;

}).call(this);