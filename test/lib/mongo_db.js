// Generated by CoffeeScript 1.9.2
(function() {
  var Db, MongoClient, Promise, _, db,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Promise = require('bluebird');

  MongoClient = require('mongodb').MongoClient;

  _ = require('lodash');

  db = false;

  exports.Instance = function(config) {
    if (db !== false) {
      return db;
    }
    console.log('Connecting to DB... (as promise w/open)', {
      config: config
    });
    return Promise.resolve().bind(this).then(function() {
      return db = new Db(config);
    }).then(function() {
      return db.open();
    }).then(function() {
      return db;
    });
  };

  Db = (function() {
    function Db(config1) {
      this.config = config1;
      this.xPutByKey = bind(this.xPutByKey, this);
      this.xGetByKey = bind(this.xGetByKey, this);
      this.xSqlQuery = bind(this.xSqlQuery, this);
      this.db = false;
      this.log = console;
    }

    Db.prototype.open = function() {
      var f;
      f = 'TEST:Db.open:';
      this.log.debug(f + 'TOP', {});
      return Promise.resolve().bind(this).then(function() {
        this.log.debug(f + 'connect', {
          config: this.config
        });
        return MongoClient.connect(this.config);
      }).then(function(client) {
        var mdb, nm, val;
        mdb = client.db('test');
        this.log.debug(f + 'connect-result', {
          mdb: mdb,
          keys: Object.keys(mdb)
        });
        this.log.debug(f + 'connect-result', {
          functions: (function() {
            var results;
            results = [];
            for (nm in mdb) {
              val = mdb[nm];
              if (typeof val === 'function') {
                results.push(nm);
              }
            }
            return results;
          })()
        });
        this.log.debug(f + 'mdb', _.pick(mdb, ['databaseName', 'options']));
        if (mdb == null) {
          throw new Error(f + 'MongoDB connection is empty');
        }
        this.db = mdb;
        this.runqueue = mdb.collection('runqueue');
        this.log.debug(f + 'collection-runqueue', this.runqueue);
        this.log.debug(f + 'collection-runqueue-keys', {
          runqueue: this.runqueue,
          keys: Object.keys(this.runqueue)
        });
        return this.log.debug(f + 'collection-runqueue-funcs', {
          functions: (function() {
            var ref, results;
            ref = this.runqueue;
            results = [];
            for (nm in ref) {
              val = ref[nm];
              if (typeof val === 'function') {
                results.push(nm);
              }
            }
            return results;
          }).call(this)
        });
      });
    };

    Db.prototype["delete"] = function(collection, query_doc) {
      console.log("\n----COLLECTION----> ", collection, typeof this[collection]);
      console.log("\n----QUERY_DOC----> ", query_doc);
      return this[collection].deleteMany(query_doc).then(function(result) {
        console.log('----RESULT-> ', result.result);
        return result.result;
      });
    };

    Db.prototype.xEnd = function() {
      this.conn.end;
      return this.conn = null;
    };

    Db.prototype.xSqlQuery = function(sql, args) {
      var p_query;
      console.log("\n----SQL----> ", sql);
      if (args) {
        console.log('----ARGS---> ', JSON.stringify(args));
      }
      if (this.conn === null) {
        throw new E.DbError('DB:SQL:BAD_CONN');
      }
      p_query = Promise.promisify(this.conn.query, {
        context: this.conn
      });
      return (p_query(sql, args)).bind(this).then(function(just_rows) {
        console.log('----RESULT-> ', 'affectedRows' in just_rows ? JSON.stringify(just_rows) : just_rows);
        return just_rows;
      });
    };

    Db.prototype.xGetOne = function(table, id) {
      return Promise.resolve().bind(this).then(function() {
        var sql;
        sql = 'SELECT * FROM ' + table + ' WHERE id= ? AND di= 0';
        return this.SqlQuery(sql, [id]);
      }).then(function(db_rows) {
        return db_rows[0];
      });
    };

    Db.prototype.xInsertOne = function(table, new_values, reread) {
      return Promise.resolve().bind(this).then(function() {
        var arg, cols, nm, qs, sql, val;
        cols = ['cr'];
        qs = ['?'];
        arg = [null];
        for (nm in new_values) {
          val = new_values[nm];
          cols.push(nm);
          qs.push('?');
          arg.push(val);
        }
        sql = 'INSERT INTO ' + table + ' (' + (cols.join(',')) + ') VALUES (' + (qs.join(',')) + ')';
        return this.SqlQuery(sql, arg);
      }).then(function(db_result) {
        if (reread === false) {
          return db_result;
        }
        return this.GetOne(table, db_result.insertId);
      }).then(function(rec) {
        return rec;
      });
    };

    Db.prototype.xDeleteByKey = function(table, key, values) {
      return Promise.resolve().bind(this).then(function() {
        var args, sql;
        sql = 'DELETE FROM ' + table + ' where ' + key + ' IN (?)';
        args = [values];
        return this.SqlQuery(sql, args);
      }).then(function(db_result) {
        return db_result;
      });
    };

    Db.prototype.xGetByKey = function(table, key, vals) {
      var vals_type;
      if (!vals) {
        throw new Error('EMPTY_VALS');
      }
      vals_type = typeof vals;
      return Promise.resolve().bind(this).then(function() {
        var args, sql;
        args = vals_type === 'number' || vals_type === 'string' ? [[vals]] : [vals];
        sql = 'SELECT * FROM ' + table + ' WHERE di= 0 AND ' + key + ' IN (?)';
        return this.SqlQuery(sql, args);
      }).then(function(db_rows) {
        return db_rows;
      });
    };

    Db.prototype.xPutByKey = function(table, key, key_val, vals) {
      if (typeof vals !== 'object') {
        throw new Error('OBJECT_VALS');
      }
      return Promise.resolve().bind(this).then(function() {
        var args, nm, sql, vals_stuff;
        vals_stuff = [];
        args = [];
        for (nm in vals) {
          vals_stuff.push(" " + nm + " = ?");
          args.push(vals[nm]);
        }
        args.push(key_val);
        sql = 'UPDATE ' + table + ' SET ' + (vals_stuff.join(',')) + ' WHERE di= 0 AND ' + key + ' = ?';
        return this.SqlQuery(sql, args);
      }).then(function(db_rows) {
        return db_rows;
      });
    };

    return Db;

  })();

}).call(this);