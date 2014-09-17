// Generated by CoffeeScript 1.4.0
var ENTER_KEY;

$(document).on("click change dblclick", "[data-action]", function(event_obj) {
  var action, aspec, aspecs, dparams, f, form_flag, params, render_flag, spec, _i, _len;
  f = 'E/DataAction:';
  console.log(f, 'got a click!');
  aspecs = $(this).attr("data-action").split(',');
  dparams = JSON.parse($(this).attr("data-params") || "{}");
  for (_i = 0, _len = aspecs.length; _i < _len; _i++) {
    aspec = aspecs[_i];
    spec = aspec.split(':');
    if (spec[0] === event_obj.type) {
      form_flag = spec[2] === 'true';
      render_flag = !(spec[3] === 'false');
      action = spec[1];
      params = $.extend({
        input_obj: this
      }, dparams);
      (function(form_flag, render_flag, action, params) {
        return setTimeout(function() {
          var i;
          return i = window.EpicMvc.Epic.makeClick(form_flag, action, params, render_flag);
        }, 5);
      })(form_flag, render_flag, action, params);
      return false;
    }
  }
});

ENTER_KEY = 13;

$(document).on("keyup", "input[data-enter]", function(event) {
  if (event.which === ENTER_KEY) {
    return window.EpicMvc.Epic.makeClick(false, $(this).attr("data-enter"), {
      title: $(this).val(),
      id: $(this).attr('data-p-id')
    }, true);
  }
});
