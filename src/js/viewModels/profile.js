define(
    ['ojs/ojcore', 'knockout', 'jquery'
    ],
    function (oj, ko, $) {
        'use strict';
        function ProfileModel() {
            var self = this;

            // this function will communicate an event with the parent window
            // typically used for applications that run inside an IFRAME to inform the
            // embedding application about what is going on.      
            self.callParent = function (message) {
                console.log('send message from Catalog to parent window');
                // here we can restrict which parent page can receive our message
                // by specifying the origin that this page should have
                var targetOrigin = '*';
                parent.postMessage(message, targetOrigin);

            }


            self.init = function () {
                // listener for events posted on the window;
                // used for applications running insidean IFRAME to receive events from the
                // embedding application
                window.addEventListener("message", function (event) {
                  console.log("Received message from embedding application " + event);
                  console.log("Payload =  " + JSON.stringify(event.data));
                  if (event.data.eventType =="globalContext") {
                      var un = event.data.payload.globalContext.userName;
                      self.username(un)
                  }
                },
                  false);
                  self.callParent({"childHasLoaded":true})
              }
              $(document).ready(function () { self.init(); })

        }

        return new ProfileModel();
    }
);
