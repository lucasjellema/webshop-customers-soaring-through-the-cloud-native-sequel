define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton'
    ],
    function (oj, ko, $) {
        'use strict';
        function ProfileModel() {
            var self = this;
            var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
            var customer = rootViewModel.globalContext.customer
            self.firstName = ko.observable(customer.firstName );
            self.lastName = ko.observable(customer.lastName);

             rootViewModel.registerGlobalContextListener(
                 function (globalContext) {
                     console.log("profile - global context listener - receiving global context "+JSON.stringify(globalContext))
                    var customer = globalContext.customer
                    self.firstName(customer.firstName );
                    self.lastName(customer.lastName);
        
                 }
             )
 

            self.saveProfile = function (event) {
                //TODO add code to save changes to the profile to the backend service 
                console.log("Handle Saving Profile")
            }

        }

        return new ProfileModel();
    }
);
