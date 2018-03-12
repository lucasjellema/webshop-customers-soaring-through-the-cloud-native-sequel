define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton'
    ],
    function (oj, ko, $) {
        'use strict';
        function SignModel() {
            var self = this;
            var customersMSAPIEndpoint = "https://oc-144-21-82-92.compute.oraclecloud.com:9129/api/customer"
            var apiKey = "73f1c312-64e1-4069-92d8-0179ac056e90"


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
                    console.log("sign in response is received, now get profile data")
                    // get profile for user with username == self.username()
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": customersMSAPIEndpoint + "/profile?email=" + self.username(),
                        "method": "GET",
                        "headers": {
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache",
                            "api-key": apiKey
                        },
                        "processData": false,
                    }

                    var promise = $.ajax(settings).then(function (data, textStatus, jqXHR) {
                        console.log('request for profile(s) successful');
                        // find profile in response
                        //find entry in array that has email equal to  self.username()
                        // then populate customer from that entry
                        var c = data.reduce(function (dummy, customer) {
                            if (customer.email == self.username()) {
                                return customer
                            }
                        }, [])

                        // setup customer variable
                        var customer = {}

                        if (c) {
                            customer = {
                                "firstName": c.firstName
                                , "lastName": c.lastName
                                , "customerIdentifier": c._id
                                , "title": c.title
                                , "email": c.email
                            }
                        } else {
                            var customer = {
                                "firstName": "Something"
                                , "lastName": "Failed"
                                , "customerIdentifier": null
                                , "title": null
                                , "email": "something.failed@soaringclouds.com"
                            }

                        }

                        // invoke doLogin on rootViewModel 

                        var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                        rootViewModel.doLogin(customer);

                    }, function (jqXHR, textStatus, errorThrown) {
                        console.log("error in profile request")
                        // TODO retrieve user profile data from the response
                        var customer = {
                            "firstName": "Will"
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
