var services = angular.module('Todo.services');
services.factory('commonService', ['$http', function ($http) {
    'use strict';

    var baseUrl = config.apiurl;
    var buildUrl = function (resourceUrl) {
        return baseUrl + resourceUrl;
    };

    return {
        getAllCountries: function () {
            return $http.get(buildUrl('common/countries/'));
        },
        getAllProtocols: function () {
            return $http.get(buildUrl('protocol/'));
        },
        createProtocol: function (protocol) {
            return $http.post(buildUrl('protocol/'), protocol);
        },
        updateProtocol: function(protocol) {
            return $http.put(buildUrl('protocol/'), protocol);
        },
        getDepartmentsGraph: function() {
            return $http.get(buildUrl('common/departments/'));
        }

    };
}]);