define(
        ['ojs/ojcore', 'knockout', 'dataService', 'appController', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojdatetimepicker', 'ojs/ojlabel', 'ojs/ojselectcombobox', 'ojs/ojswitch'
        ],
        function (oj, ko, data, app
                ) {
            'use strict';

            function ProfileModel() {

                var self = this;
                self.serviceURL = 'http://129.213.126.223:8011/customer';


                self.firstName = ko.observable();
                self.lastName = ko.observable();
                self.title = ko.observable();
                self.email = ko.observable();
                self.dateOfBirth = ko.observable();
                self.password = ko.observable();

                self.newsLetter = ko.observable();
                self.offer = ko.observable();
                self.addressType = ko.observable();
                self.streetName = ko.observable();
                self.streetNumber = ko.observable();
                self.city = ko.observable();
                self.postcode = ko.observable();
                self.country = ko.observable();
                self.paymentType = ko.observable();
                self.cardNumber = ko.observable();
                self.expirationDate = ko.observable();
                self.nameOnCard = ko.observable();
                let customer = ko.observable();
                let id = ko.observable();
                let signup = ko.observable();
                self.signedin = ko.observable();


                self.handleActivated = function (info) {
                    self.id = sessionStorage.getItem('profileId');
                    self.signup = sessionStorage.getItem('signUp');
                    
                    // we either are in signing up (true), or just signed in (have an id), or landed here by default and should go to sign in
                    if (self.signup === 'true') {
                        console.log('signing up');
                        self.signedin(false);
                        self.customer = {};
                        self.customer.addresses = [];
                        self.customer.paymentDetails = {};
                        self.customer.preferences = {}; 
                    } else if(self.id) {
                        self.signedin(true);
                        getUserProfile();
                    } else{
                        app.router.go('sign');
                    }

                };

                function getUserProfile() {
                    return new Promise(function (resolve, reject) {
                        data.getUserProfile(self.id).then(function (response) {
                            console.log('response: ' + JSON.stringify(response));
                            processUserProfile(response, resolve, reject);
                        }).catch(function (response) {
                            console.error('exception getting profile');
                            processUserProfile(response, resolve, reject);
                        });

                    });
                    ;
                }
                ;

                function processUserProfile(response, resolve, reject) {
                    var result = response;
                    if (result) {
                        self.customer = result;
                        resolve(mapCustomer(self.customer));
                        return;
                    }

                    var message = 'Failed to load user profile ' + response;
                    console.error(message);
                    reject(message);
                }

                function mapCustomer(customer) {
                    self.firstName(customer.firstName);
                    self.lastName(customer.lastName);
                    self.title(customer.title);
                    self.email(customer.email);
                    self.dateOfBirth(customer.dateOfBirth);
                    self.password(customer.password);

                    if (customer.preferences) {
                        self.newsLetter(customer.preferences.newsLetter);
                        self.offer(customer.preferences.offers);
                    }


                    if (customer.addresses) {
                        if (customer.addresses.length > 0) {
                            self.addressType(customer.addresses[0].type);
                            self.streetName(customer.addresses[0].streetName);
                            self.streetNumber(customer.addresses[0].streetNumber);
                            self.postcode(customer.addresses[0].postcode);
                            self.city(customer.addresses[0].city);
                            self.country(customer.addresses[0].country);
                        } else {
                            customer.addresses = {};

                        }
                    }


                    if (customer.paymentDetails) {
                        if (customer.paymentDetails.length > 0) {
                            self.paymentType(customer.paymentDetails[0].type);
                            self.cardNumber(customer.paymentDetails[0].cardNumber);
                            self.expirationDate(customer.paymentDetails[0].expirationDate);
                            self.nameOnCard(customer.paymentDetails[0].nameOnCard);
                        }
                    }

                }
                ;


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
                            "offers": self.offer()
                        }
                    };

                    if (self.streetName()) {
                        var addressBilling = {
                            "type": self.addressType(),
                            "streetName": self.streetName(),
                            "streetNumber": self.streetNumber(),
                            "city": self.city(),
                            "postcode": self.postcode(),
                            "country": self.country()
                        };

                        var addresses = [];
                        addresses.push(addressBilling);
                        updatedCustomer.addresses = addresses;
                        //TODO add delivery address
                    }

                    if (self.cardNumber()) {
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

                    //todo add phone numbers



                    if (self.customer._id) {
                        //update the profile
                        return $.ajax({
                            type: 'PUT',
                            url: self.serviceURL + "/profile/" + self.customer._id,
                            data: JSON.stringify(updatedCustomer),
                            contentType: 'application/json; charset=UTF-8',

                            success: function (data) {
                                self.customer = data;
                                return true;
                            },
                            failure: function (textStatus, errorThrown) {
                                alert('Update Failed' + textStatus);
                                return false;

                            }
                        }).done(function (response) {
                            console.log(response);
                            alert('changes saved');

                        }).fail(function (textStatus, errorThrown) {
                            console.error(textStatus.responseText);
                            console.error(errorThrown);
                            alert(textStatus.repsonseText);

                        });
                    } else {
                        return $.ajax({
                            type: 'POST',
                            url: self.serviceURL + "/profile/",
                            data: JSON.stringify(updatedCustomer),
                            contentType: 'application/json; charset=UTF-8',

                            success: function (data) {
                                console.log(data);
                                return true;
                            },
                            failure: function (textStatus, errorThrown) {
                                console.error(errorThrown);
                                alert('Login Failed' + textStatus);
                                return false;

                            }
                        }).done(function (response) {

                            console.log(response);
                            alert(response.message);
                            sessionStorage.setItem('signUp', false);
                            app.router.go('sign');

                        }).fail(function (textStatus, errorThrown) {
                            console.error(errorThrown);
                            alert('error updating: ' + JSON.stringify(textStatus));

                        });
                    }

                };

            }

            return new ProfileModel();
        }
);
