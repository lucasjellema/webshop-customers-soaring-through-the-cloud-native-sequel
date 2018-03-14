define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojdatetimepicker', 'ojs/ojlabel', 'ojs/ojselectcombobox', 'ojs/ojswitch'
    ],
    function (oj, ko, $) {
        'use strict';
        function ProfileModel() {
            
            var self = this;
            
            var customersMSAPIEndpoint = "https://oc-144-21-82-92.compute.oraclecloud.com:9129/api/customer"
            //var customersMSAPIEndpoint = "http://localhost:8080/customer";
            
            var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
            var customer = rootViewModel.globalContext.customer;
     
            self.firstName = ko.observable(customer.firstName );
            self.lastName = ko.observable(customer.lastName);
            self.title = ko.observable(customer.title);
            self.email = ko.observable (customer.email);
            self.dateOfBirth = ko.observable(customer.dateOfBirth);
            self.password = ko.observable(customer.password);
            var newsletter = "false";
            var offers = "false";
            if(customer.preferences){
                newsletter = customer.preferences.newsLetter;
                offers = customer.preferences.offers;
            }
            self.newsLetter = ko.observable(newsletter);
            self.offers = ko.observable(offers);
            
            if(customer.addresses){
                //put the address in
            }

 

            self.saveProfile = function (event) {
                
                var updatedCustomer = {
                    "firstName": self.firstName(),
                    "lastName": self.lastName(),
                    "title": self.title(),
                    "email": self.email(),
                    "dateOfBirth": self.dateOfBirth().toString(),
                    "password": self.password(),
                    "preferences": {
                        "newsLetter": self.newsLetter(),
                        "offers": self.offers()
                        
                    }
                };

                return $.ajax({
                    type: 'PUT',
                    url: customersMSAPIEndpoint + "/profile/" + customer._id,
                    data: JSON.stringify(updatedCustomer),
                    contentType: 'application/json; charset=UTF-8',

                    success: function (msg, status, jqXHR) {
                        return true;
                    },
                    failure: function (textStatus, errorThrown) {
                        alert('Login Failed' + textStatus);
                        return false;

                    }
                }).done(function (response) {
                    //we are done saving

                }).fail(function (textStatus, errorThrown) {
                    alert('error updating: ' + JSON.stringify(textStatus));

                });

            };

        }

        return new ProfileModel();
    }
);
