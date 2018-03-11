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
                    var user = {
                        'username': self.username(),
                        'password': self.password()
                    };

                    alert('user: ' + JSON.stringify(user));

                    return $.ajax({
                        type: 'POST',
                        url: "http://localhost:8080/customer/signin",
                        data: JSON.stringify(user),
                        contentType: 'application/json; charset=UTF-8',
                        
                        success: function () {
                            var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                            rootViewModel.doLogin(self.username());
                            return true;
                        },
                        failure: function (textStatus, errorThrown) {
                            alert('Login Failed' + textStatus);
                            return false;

                        }
                    }).done(function(){
                        alert('done');
                    }).fail(function(event){
                        alert ('event: ' + JSON.stringify(event));

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
