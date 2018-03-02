define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton'
    ],
    function (oj, ko, $) {
        'use strict';
        function SignModel() {
            var self = this;


            self.username = ko.observable();
            self.password = ko.observable();

            self.loginButtonClick = function (event) {
                //TODO add check on username and password
                console.log("Logged in as " + self.username());

                var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                rootViewModel.doLogin(self.username())
                // var us = rootViewModel.userLogin;
                // console.log("username = " + rootViewModel.userLogin())
                // rootViewModel.userLogin(self.username());
                // rootViewModel.userLoggedIn("Y");
                // var signinEvent = {
                //     "eventType": "userSignInEvent"
                //     , "payload": {
                //         "username": self.username()
                //     }
                // }
                // rootViewModel.callParent(signinEvent)
                return true;
            }

            self.init = function () {
            }
            $(document).ready(function () { self.init(); })

        }

        return new SignModel();
    }
);
