// Generated by CoffeeScript 1.9.2
(function() {
  var GenericService, Promise, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Promise = require('bluebird');

  _ = require('lodash');

  GenericService = (function() {
    GenericService.deps = {
      services: ['config', 'error'],
      config: ''
    };

    function GenericService(kit) {
      this.FailThenSucceed = bind(this.FailThenSucceed, this);
      this.Fail = bind(this.Fail, this);
      this.Repeat = bind(this.Repeat, this);
      this.Success = bind(this.Success, this);
      var f;
      f = 'GenericService::constructor';
      this.log = kit.services.logger.log;
      this.E = kit.services.error;
      this.config = kit.services.config.tropo;

      /*
      		@base_opts= _.merge
      			json: true # request-promise package will parse the response for us
      			url: @config.ApiUrl # To be appended to by caller
      			headers: {}
      		,@config.options
       */
      this.log.debug(f, this);
    }

    GenericService.prototype.Success = function(job) {
      var e, f;
      f = 'GenericService::Success:';
      e = f;
      this.log.debug(f, {
        job: job
      });
      this.log.debug(f + 'JSON', JSON.parse(job.json));
      return {
        success: true
      };
    };

    GenericService.prototype.Repeat = function(job) {
      var e, f;
      f = 'GenericService::Repeat:';
      e = f;
      this.log.debug(f, {
        job: job
      });
      this.log.debug(f + 'JSON', JSON.parse(job.json));
      return {
        success: true,
        replace: {
          json: job.json,
          run_at: [20, 's']
        }
      };
    };

    GenericService.prototype.Fail = function(job) {
      var e, f;
      f = 'GenericService::Fail:';
      e = f;
      this.log.debug(f, {
        job: job
      });
      this.log.debug(f + 'JSON', JSON.parse(job.json));
      throw new Error('What a terrible failure');
    };

    GenericService.prototype.FailThenSucceed = function(job) {
      var e, f;
      f = 'GenericService::FailThenSucceed:';
      e = f;
      this.log.debug(f, {
        job: job
      });
      this.log.debug(f + 'JSON', JSON.parse(job.json));
      if (job.retries) {
        return {
          success: true
        };
      } else {
        throw new Error('What a terrible failure');
      }
    };

    return GenericService;

  })();

  exports.GenericService = GenericService;

}).call(this);