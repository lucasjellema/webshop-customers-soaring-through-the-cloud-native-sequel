define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton'
    ],
    function (oj, ko, $) {
        'use strict';
        function SignModel() {
            var self = this;
            var customersMSAPIEndpoint = "http://oc-129-156-113-240.compute.oraclecloud.com:8011/customer"
            //var customersMSAPIEndpoint = "http://localhost:8080/customer";
            //var apiKey = "73f1c312-64e1-4069-92d8-0179ac056e90"


            self.username = ko.observable();
            self.password = ko.observable();

            self.loginButtonClick = function (event) {
                var user = {
                    'username': self.username(),
                    'password': self.password()
                };


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
                        // invoke doLogin on rootViewModel 
                        var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                        rootViewModel.doLogin(response);

                }).fail(function (textStatus, errorThrown) {
                    alert('error logging in: ' + JSON.stringify(textStatus));

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
