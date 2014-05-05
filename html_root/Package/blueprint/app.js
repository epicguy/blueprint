// Generated by CoffeeScript 1.6.3
(function() {
  window.EpicMvc.app$blueprint = {
    OPTIONS: {
      login: {
        flow: 'anon'
      },
      template: {
        "default": 'logged_out'
      },
      settings: {
        group: 'blueprint',
        show_issues: 'inline'
      }
    },
    MODELS: {
      User: {
        "class": 'User',
        inst: 'bpU',
        forms: 'Login'
      }
    },
    MACROS: {
      start: {
        call: 'User/check',
        RESULTS: [
          {
            r: {
              valid: 'yes'
            },
            call: 'Pageflow/path',
            p: {
              path: 'logged_in//'
            }
          }
        ]
      }
    },
    CLICKS: {
      Xbrowser_hash: {
        call: "User/parse_hash",
        use_fields: "hash",
        RESULTS: [
          {
            r: {
              page: 'app'
            },
            call: 'User/url_landing_context',
            use_result: 'code:context',
            RESULTS: [
              {
                r: {},
                call: 'User/check',
                RESULTS: [
                  {
                    r: {
                      valid: 'yes'
                    },
                    call: 'Pageflow/path',
                    p: {
                      path: 'logged_in/home/app_detail'
                    }
                  }
                ]
              }
            ]
          }, {
            r: {},
            macro: 'start'
          }
        ]
      },
      logout: {
        call: 'User/logout',
        RESULTS: [
          {
            r: {},
            call: 'Pageflow/path',
            p: {
              path: 'anon//'
            }
          }
        ]
      }
    },
    FLOWS: {
      anon: {
        start: 'login',
        TRACKS: {
          login: {
            start: 'login',
            STEPS: {
              login: {
                page: 'login',
                CLICKS: {
                  login: {
                    call: 'User/login',
                    use_form: 'Login',
                    RESULTS: [
                      {
                        r: {
                          success: 'SUCCESS'
                        },
                        call: 'Pageflow/path',
                        p: {
                          path: 'logged_in'
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      logged_in: {
        start: 'home',
        template: 'logged_in',
        TRACKS: {
          home: {
            start: 'app_listing',
            CLICKS: {
              home: {
                call: 'User/home',
                RESULTS: [
                  {
                    r: {},
                    call: 'Pageflow/path',
                    p: {
                      path: '//app_listing'
                    }
                  }
                ]
              },
              view_details: {
                call: 'User/view_details',
                use_fields: 'id',
                RESULTS: [
                  {
                    r: {},
                    call: 'Pageflow/path',
                    p: {
                      path: '//app_overview'
                    }
                  }
                ]
              }
            },
            STEPS: {
              app_listing: {
                page: 'app_listing'
              }
            }
          }
        }
      }
    }
  };

}).call(this);
