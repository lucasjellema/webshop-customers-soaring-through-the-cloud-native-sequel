/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojrouter', 'ojs/ojmoduleanimations'],
        function (oj, ko) {


            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
            var router = oj.Router.rootInstance;
            router.configure({
                'profile': {label: 'Profile'},
                'sign': {label: 'Sign', isDefault: true}
            });

            function ControllerViewModel() {
                var self = this;
                self.globalContext = {};

                self.router = router;

                self.pendingAnimationType = null;

                function switcherCallback() {
                    return self.pendingAnimationType;
                }

                function mergeConfig(original) {
                    return $.extend(true, {}, original, {
                        'animation': oj.ModuleAnimations.switcher(switcherCallback),
                        'cacheKey': self.router.currentValue()
                    });
                }

                self.moduleConfig = mergeConfig(self.router.moduleConfig);

                $(document).ready(function () {
                    self.init();
                });

                // Media queries for repsonsive layouts
                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

                // Header
                // Application Name used in Branding Area
                self.appName = ko.observable("Customers Profile");

                // User Info used in Global Navigation area
                self.userLogin = ko.observable("Not yet logged in");
                self.userLoggedIn = ko.observable(window.sessionStorage.userLoggedIn);

                self.doLogin = function (customer) {
                    self.globalContext.customer = customer;
                    self.userLogin(self.globalContext.customer.title + " " + self.globalContext.customer.firstName + " " + self.globalContext.customer.lastName);
                    self.userLoggedIn("Y");
                    $(window).sessionStorage.userLoggedIn = true;
                    $(window).sessionStorage.profileId = customer._id;
                    self.globalContext.username = customer.email;
                    self.globalContext.userLoggedIn = "Y";
                    var signinEvent = {
                        "eventType": "userSignInEvent"
                        , "source": "Customers Portlet"
                        , "payload": {
                            "username": customer.email,
                            "customer": customer
                        }
                    };
                    self.callParent(signinEvent);

                };



                // this function will communicate an event with the parent window
                // typically used for applications that run inside an IFRAME to inform the
                // embedding application about what is going on.      
                self.callParent = function (message) {
                    console.log('send message from Customers to parent window');
                    // here we can restrict which parent page can receive our message
                    // by specifying the origin that this page should have
                    var targetOrigin = '*';
                    message.sourcePortlet = "customers";
                    parent.postMessage(message, targetOrigin);

                };
                self.globalContextListeners = [];
                self.registerGlobalContextListener = function (listener) {
                    self.globalContextListeners.push(listener);
                };

                self.init = function () {
                    // listener for events posted on the window;
                    // used for applications running insidean IFRAME to receive events from the
                    // embedding application
                    console.log('in init appcontroler');
                    var username = self.globalContext.userName;
                    console.log('self.globalConext.userName = ' + self.globalContext.userName);
                    console.log('window.sessionStorage.userLoggedIn: ' + window.sessionStorage.userLoggedIn);
                    window.addEventListener("message", function (event) {
                        console.log("Received message from embedding application " + event);
                        console.log("Payload =  " + JSON.stringify(event.data));
                        if (event.data.eventType === "globalContext") {
                            self.globalContext = event.data.payload.globalContext;
                            if (self.globalContext.customer) {
                                self.userLogin(self.globalContext.customer.title + " " + self.globalContext.customer.firstName + " " + self.globalContext.customer.lastName);
                                username = self.globaContext.customer.email;
                            }
                            ;
                            this.console.log("Message from global context - username = " + username);
                            if (!username || username === "Not yet logged in" || username === "") {
                                self.userLoggedIn("N");
                                router.go('sign');
                            } else {
                                self.userLoggedIn("Y");
                                router.go('profile').then(
                                        function (result) {
                                            if (!result.hasChanged()) {
                                            } else {
                                                oj.Router.sync();
                                            }
                                        },
                                        function (error) {
                                            console.error("transition failed to profile " + error);
                                        }
                                );
                            }
                            //inform listeners of new global context
                            self.globalContextListeners.forEach(function (listener) {
                                listener(self.globalContext);
                            });
                        }
                    },
                            false);
                    self.callParent({"childHasLoaded": true});
                };


            }

            return new ControllerViewModel();
        }
);
