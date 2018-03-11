define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton'
    ],
    function (oj, ko, $) {
        'use strict';
        function SignModel() {
            var self = this;
            var customersMSAPIEndpoint = "https://oc-144-21-82-92.compute.oraclecloud.com:9129/api/customer"


            self.username = ko.observable();
            self.password = ko.observable();

            self.loginButtonClick = function (event) {
                var user = {
                    'username': self.username(),
                    'password': self.password()
                };

                //  alert('user: ' + JSON.stringify(user));

                return $.ajax({
                    type: 'POST',
                    url: customersMSAPIEndpoint + "/signin",
                    data: JSON.stringify(user),
                    contentType: 'application/json; charset=UTF-8',

                    success: function (msg, status, jqXHR) {
                        return true;
                    },
                    failure: function (textStatus, errorThrown) {
                        alert('Login Failed' + textStatus);
                        return false;

                    }
                }).done(function (response) {
                    console.log("response is received, what to do next?")
                    // get profile for user with username == self.username()
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": customersMSAPIEndpoint + "/profile?email=" + self.username(),
                        "method": "GET",
                        "headers": {
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache",
                        },
                        "processData": false,
                    }

                        var promise = $.ajax(settings) .then(function( data, textStatus, jqXHR ) {
                            console.log('request successful');
                            //TODO
                            // find profile in response
                            // setup customer variable
                            // invoke doLogin on rootViewModel 
                          }, function( jqXHR, textStatus, errorThrown ) {
                              console.log("error in profile request")
                            // TODO retrieve user profile data from the response
                            var customer = { "firstName": "Will"
                            , "lastName": "Smith"
                            , "customerIdentifier": "5aa3d2ac19cf310011ca7b90"
                            , "title": "Mr"
                            , "email": "will.smith@randommail.uk"
                         }
    
                            var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                            rootViewModel.doLogin(customer);
                        }); // end of promise





                    
                }).fail(function (event) {
                    alert('event: ' + JSON.stringify(event));

                });


            };

            self.init = function () {
            };
            $(document).ready(function () {
                self.init();
            });

        }

        return new SignModel();
    }
);
