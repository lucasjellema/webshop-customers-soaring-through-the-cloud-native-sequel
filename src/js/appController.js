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
                'profile': {label: 'Profile', isDefault: true },
                'sign': {label: 'Sign'}
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

                
                self.userLoggedIn = ko.observable(JSON.parse(sessionStorage.getItem('userLoggedIn')));

                self.doLogin = function (customer) {
                    console.log('logging in');
                    self.globalContext.customer = customer;
                    self.userLoggedIn("Y");
                    sessionStorage.setItem('userLoggedIn', true);
                    sessionStorage.setItem('profileId', customer._id);
                    sessionStorage.setItem('signUp', false);
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
                    console.log('self.globalConext.userName = ' + self.globalContext.userName);
                    console.log('sessionStorage.userLoggedIn: ' + JSON.parse(sessionStorage.getItem('userLoggedIn')));
                    window.addEventListener("message", function (event) {
                        if (event.data.eventType === "globalContext") {
                            self.globalContext = event.data.payload.globalContext;
                            if (self.globalContext.customer) {
                                username = self.globalContext.customer.email;
                            }
                            ;
                            if (!self.globalContext.userName || self.globalContext.userName === "Not yet logged in" || self.globalContext.userName === "") {
                                self.userLoggedIn("N");
                                sessionStorage.setItem('userLoggedIn', false);
                                sessionStorage.setItem('profileId', null);
                                router.go('sign');
                            } else {
                                self.userLoggedIn("Y");
                                router.go('profile');
                            }
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
