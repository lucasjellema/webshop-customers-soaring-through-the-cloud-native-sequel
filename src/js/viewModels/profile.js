define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojdatetimepicker', 'ojs/ojlabel', 'ojs/ojselectcombobox', 'ojs/ojswitch'
    ],
    function (oj, ko, $) {
        'use strict';
        function ProfileModel() {
            
            var self = this;
            
            var customersMSAPIEndpoint = "http://oc-129-156-113-240.compute.oraclecloud.com:8011/customer"
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
            
            var addressType = "BILLING";
            var streetName;
            var streetNumber;
            var city;
            var country;
            
            
            if(customer.addresses){
                if(customer.addresses.length > 0){
                    addressType = customer.addresses[0].type;
                    streetName = customer.addresses[0].streetName;
                    streetNumber = customer.addresses[0].streetNumber;
                    city = customer.addresses[0].city;
                    country = customer.addresses[0].country;
                }
            }
            
            self.addressType = ko.observable(addressType);
            self.streetName = ko.observable(streetName);
            self.streetNumber = ko.observable(streetNumber);
            self.city = ko.observable(city);
            self.country = ko.observable(country);
  
            
            //payment details
            //TODO make it take multiple cards, currently it only shows the first card and you can only update a card, not add it.
            var paymentType = "CREDIT";
            var cardNumber = "";
            var expirationDate = "";
            var nameOnCard = customer.lastName;
            
            if(customer.paymentDetails){
                if(customer.paymentDetails.length > 0){
                    paymentType = customer.paymentDetails[0].type;
                    cardNumber = customer.paymentDetails[0].cardNumber;
                    expirationDate = customer.paymentDetails[0].expirationDate;
                    nameOnCard = customer.paymentDetails[0].nameOnCard;
                }
            }

            self.paymentType = ko.observable(paymentType);
            self.cardNumber = ko.observable(cardNumber);
            self.expirationDate = ko.observable(expirationDate);
            self.nameOnCard = ko.observable(nameOnCard);

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
                
                 if(customer.paymentDetails){
                    var updatedPaymentDetail = {
                    "type": self.paymentType(),
                    "cardNumber": self.cardNumber(),
                    "expirationDate": self.expirationDate(),
                    "nameOnCard": self.nameOnCard()
                    };
                    
                    var details = [];
                    details.push(updatedPaymentDetail);
                    updatedCustomer.paymentDetails = details;
                }
                
                
                //TODO save the address and make it possible to add addresses

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
