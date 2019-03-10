/**
 * All data services
 * @param {type} $
 * @param {type} appConfig
 * @returns {undefined}
 */
'use strict';
define(['jquery'], function ($) {

    var customersMSAPIEndpoint = "http://129.213.126.223:8011/customer";
    //var customersMSAPIEndpoint = "http://localhost:8080/customer";
    //var apiKey = "73f1c312-64e1-4069-92d8-0179ac056e90"

    function signIn(user) {
        return $.ajax({
            type: 'POST',
            url: customersMSAPIEndpoint + "/signin",
            data: JSON.stringify(user)
        });
    }
    ;

    function getUserProfile(id) {
        return $.ajax({
            type: 'GET',
            url: customersMSAPIEndpoint + "/profile/" + id
        });
    }
    ;

    function updateProfile(customer) {
        return $.ajax({
            type: 'PUT',
            url: customersMSAPIEndpoint + "/profile/" + customer._id,
            data: JSON.stringify(customer),
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json'

        });
    }
    ;

    function createProfile(customer) {
        return $.ajax({
            type: 'POST',
            url: customersMSAPIEndpoint + "/profile/",
            data: JSON.stringify(customer),
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json'
        });
    }
    ;

    return {
        signIn: signIn,
        getUserProfile: getUserProfile,
        updateProfile: updateProfile,
        createProfile: createProfile
    };
});


