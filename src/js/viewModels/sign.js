define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton'
    ],
    function (oj, ko, $) {
        'use strict';
        function SignModel() {
            var self = this;
            var customersMSAPIEndpoint = "http://oc-129-156-113-240.compute.oraclecloud.com:8011/customer";
            //var customersMSAPIEndpoint = "http://localhost:8080/customer";
            //var apiKey = "73f1c312-64e1-4069-92d8-0179ac056e90"


            self.username = ko.observable();
            self.password = ko.observable();  
            self.loginResult = ko.observable();
            self.customer;
            
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
                    dataType: 'json',

                    success: function (data) {
                        console.log(data);
                        window.sessionStorage.customer = data;
                        return true;
                    },
                    failure: function (textStatus, errorThrown) {
                        user = {};
                        self.username= '';
                        self.password = '';
                        return false;

                    }
                }).done(function (response) {
                        var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                        rootViewModel.doLogin(response);
                        window.sessionStorage.userLoggedIn = true;
                        oj.Router.rootInstance.go('profile');

                }).fail(function (textStatus, errorThrown) {
                    console.log(textStatus.responseText);
                    alert(textStatus.responseText);
                });

            };
            
            
            self.signUpLinkClick = function (event) {
                var user = {
                    'username': self.username(),
                    'password': self.password()
                };
               
                oj.Router.rootInstance.go('profile');

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
