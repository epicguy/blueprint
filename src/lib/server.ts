//
//	Server Initialization
//
//  Config setings (createServer; resify: handlers,allow_headers; api: static_file_server,port;)
//  restify.createServer @config.createServer
//  for handler in @config.restify.handlers
//  res.setHeader 'access-control-allow-headers', @config.restify.allow_headers
//  server.get /.*/, restify.serveStatic @config.api.static_file_server
//  server.listen @config.api.port, cb

import restify from "restify";
import merge from "lodash/merge";
import isString from "lodash/isString";

interface Kit {}

interface IFunc {
  (): void;
}

export default class Server {
  restify_logger: IFunc;
  log: IFunc;
  config: object;
  server: Server;
  public constructor(config: object, logger: object, restify_logger) {
    this.config = config;
    this.log = logger.log;
    this.restify_logger = restify_logger;
    this.server = false;
    this.log.info("Server Initialized");
  }

  public create() {
    const options = merge(
      {},   
      {
        log: this.restify_logger ? this.restify_logger : this.log
      },
      this.config.createServer
    );
    this.server = restify.createServer(options);
  }

  public start(cb) {
    return this.server.listen(this.config.api.port, cb);
  }

  public addRestifyHandlers() {
    for (let handler in this.config.restify.handlers) {
      // @log.info "(restify handler) Server.use #{handler}", @config.restify[ handler]
      this.server.use(restify.plugins[handler], this.config.restify[ handler])
    }
  }

  public handleOptions() {
    // Handle all OPTIONS requests to a deadend (Allows CORS to work them out)
		// @log.info "(restify) Server.opts", @config.restify.allow_headers
		this.server.opts('/*', ( req: restify.Request, res: restify.Response ) => {
			res.setHeader('access-control-allow-headers', (this.config.restify.allow_headers || []).join(', '));
      res.send(204);
    });

  }

  public parseJSON() {
    this.server.use((req: restify.Request, res: restify.Response, next: restify.Next) => {
      if ("JSON" in req.params) {
        merge(req.params, JSON.parse(req.params.JSON))
      }
      next();
    })
  }

  public stripHTML() {
    this.server.use((req, res, next) => {
      for (let param of req.params) {
      if(req.params[param] && isString(req.params[param])) {
        req.params[param]= req.params[param].replace(/[<>]/g, "");
      }
    }
    next();
    })
  }

  public addStaticServer() {
    // Static File Server (Must be last Route Created)
		const apiPath= '/api/*'
		const m= 'Api request did not match your route + method (extra slash?)'
		this.server.get(apiPath, (q,r,n) => {
      // r.send(new E.BadRequestError(m) // Don't let static-server match api calls
    }) 
		const path= '/*'
		// @log.debug "(restify) serveStatic", {path,"@config.api.static_file_server":@config.api.static_file_server}
		this.server.get(path, restify.plugins.serveStatic(this.config.api.static_file_server);
		// # serveStatic = require 'serve-static-restify'
  }

  // public get() {
  //   return this.server;
  // }
}
