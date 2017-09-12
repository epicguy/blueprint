// Generated by CoffeeScript 1.9.2
(function() {
  var _, update_deps;

  _ = require('lodash');

  exports.start = function(include_server, services_enabled, routes_enabled, mysql_enabled, mysql_mods_enabled, mongo_enabled, more_config, more_kit) {
    var ErrorMore, Kit, Logger, M, Promise, Server, config, fn, i, j, kit, len, len1, log, mod, mysql_nods_enabled, nm, opts, path, q_result, ref, ref1, ref2, ref3, ref4, route, routePath, server, service, servicePath;
    if (mysql_enabled == null) {
      mysql_enabled = false;
    }
    if (mysql_mods_enabled == null) {
      mysql_mods_enabled = [];
    }
    if (mongo_enabled == null) {
      mongo_enabled = false;
    }
    if (more_config == null) {
      more_config = {};
    }
    if (more_kit == null) {
      more_kit = {};
    }
    server = false;
    M = require('moment');
    Promise = require('bluebird');
    path = require('path');
    _ = require('lodash');
    M.defaultFormat = 'YYYY-MM-DD HH:mm:ss';
    Kit = require('./lib/kit').Kit;
    config = (require('./config'))();
    config = _.merge(config, more_config);
    Logger = require('./lib/logger').Logger;
    ErrorMore = require('./lib/error');
    kit = new Kit;
    kit.add_service('config', config);
    kit.new_service('logger', Logger);
    kit.add_service('error', ErrorMore);
    kit = _.merge(kit, more_kit);
    log = kit.services.logger.log;
    if (mysql_enabled) {
      config.db.mysql.enable = mysql_enabled;
    }
    config.db.mysql.mods_enabled = mysql_mods_enabled;
    if (mongo_enabled) {
      config.db.mongo.enable = mongo_enabled;
    }
    if (include_server) {
      Server = require('./lib/server').Server;
      server = new Server(kit);
      server.create();
      kit.add_service('server', server);
    }
    ref = update_deps(kit, services_enabled, routes_enabled, mysql_mods_enabled), services_enabled = ref[0], mysql_nods_enabled = ref[1];
    for (i = 0, len = services_enabled.length; i < len; i++) {
      nm = services_enabled[i];
      mod = kit.services.config.service_modules[nm];
      if (!mod) {
        throw new Error("No such service-module: " + nm);
      }
      mod.name = nm;
      log.info("Initializing " + mod["class"] + " Service...");
      opts = mod.instConfig ? [mod.instConfig] : null;
      servicePath = path.join(config.processDir, mod.file);
      kit.new_service(mod.name, (require(servicePath))[mod["class"]], opts);
    }
    if (server) {
      server.add_restify_handlers();
    }
    if (server) {
      server.handle_options();
    }
    if (server) {
      ref1 = kit.services;
      for (nm in ref1) {
        service = ref1[nm];
        if (!(typeof service.server_use === 'function')) {
          continue;
        }
        log.info("Calling server.use for service: " + nm);
        server.server.use(service.server_use);
      }
    }
    if (server) {
      server.parse_json();
    }
    if (server) {
      server.strip_html();
    }
    for (j = 0, len1 = routes_enabled.length; j < len1; j++) {
      nm = routes_enabled[j];
      mod = kit.services.config.route_modules[nm];
      if (!mod) {
        throw new Error("No such route-module: " + nm);
      }
      mod.name = nm;
      log.info("Initializing " + mod["class"] + " Routes...");
      routePath = path.join(config.processDir, mod.file);
      kit.new_route_service(mod.name, (require(routePath))[mod["class"]]);
      kit.services.wrapper.add(mod.name);
    }
    q_result = Promise.resolve().bind(this);
    ref2 = kit.services;
    fn = function(service) {
      if (typeof service.server_init === 'function') {
        q_result = q_result.then(function() {
          return service.server_init(kit);
        });
      }
      if (typeof service.server_init_promise === 'function') {
        return (function(service) {
          return q_result = service.server_init_promise(kit, q_result);
        })(service);
      }
    };
    for (nm in ref2) {
      service = ref2[nm];
      fn(service);
    }
    ref3 = kit.routes;
    for (nm in ref3) {
      route = ref3[nm];
      if (typeof route.server_init === 'function') {
        (function(route) {
          return q_result = q_result.then(function() {
            return route.server_init(kit);
          });
        })(route);
      }
    }
    ref4 = kit.services;
    for (nm in ref4) {
      service = ref4[nm];
      if (typeof service.server_start === 'function') {
        (function(service) {
          return q_result = q_result.then(function() {
            return service.server_start(kit);
          });
        })(service);
      }
    }
    if (server) {
      q_result = q_result.then(function() {
        server.add_static_server();
        return new Promise(function(resolve, reject) {
          var err;
          try {
            return server.start(function() {
              log.info('Server listening at', server.server.url);
              return resolve(null);
            });
          } catch (_error) {
            err = _error;
            return reject(err);
          }
        });
      });
    }
    q_result = q_result.then(function() {
      log.debug('SERVER NORMAL START');
      return kit;
    });
    q_result = q_result["catch"](function(err) {
      log.error(err);
      log.error('SERVER FAILED TO INITIALIZE. EXITING NOW!');
      return process.exit(1);
    });
    return q_result;
  };

  update_deps = function(kit, services_enabled, routes_enabled, mysql_mods_enabled) {
    var all_mods, all_services, dep, deps, i, j, k, len, len1, len2, mod, new_services, nm, services_to_check;
    all_services = _.uniq(services_enabled);
    all_mods = _.uniq(mysql_mods_enabled);
    for (i = 0, len = routes_enabled.length; i < len; i++) {
      nm = routes_enabled[i];
      mod = kit.services.config.route_modules[nm];
      if (!mod) {
        throw new Error("No such route-module: " + nm);
      }
      deps = kit.get_service_deps_needed(nm, mod["class"]);
      _log(f + ':route', {
        nm: nm,
        deps: deps
      });
      for (nm in deps) {
        all_services.push(nm);
      }
    }
    all_services = _.uniq(all_services);
    services_to_check = all_services;
    while (services_to_check.length) {
      new_services = [];
      for (j = 0, len1 = services_to_check.length; j < len1; j++) {
        nm = services_to_check[j];
        mod = kit.services.config.service_modules[nm];
        if (!mod) {
          throw new Error("No such service-module: " + nm);
        }
        deps = kit.get_service_deps_needed(nm, mod["class"]);
        for (k = 0, len2 = deps.length; k < len2; k++) {
          dep = deps[k];
          if ((all_services.indexOf(dep)) === -1) {
            new_services.push(dep);
          }
        }
      }
      services_to_check = _.uniq(new_services);
      _log(f + ':services', {
        services_to_check: services_to_check
      });
    }
    return [all_services, all_mods];
  };

}).call(this);
