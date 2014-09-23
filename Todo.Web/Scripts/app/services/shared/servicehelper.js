
var services = angular.module('todo.services');
services.factory('serviceHelper', ['$http', '$resource', function ($http, $resource) {
    'use strict';
    
    var baseUrl = config.apiurl;
    var buildUrl = function (resourceUrl) {
        return baseUrl + resourceUrl;
    };

    var addRequestHeader = function (key, value) {

    };
    return {
        AuthorizationToken: $resource(buildUrl("token"), null, {
            requestToken: { method: 'POST', headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        }),
        Account: $resource(buildUrl('account/'), null, {
            register: { method: 'post' },
            logOff: { method: 'put' },
            get: {method: 'get', isArray: true}
        })
    
    };
}]);