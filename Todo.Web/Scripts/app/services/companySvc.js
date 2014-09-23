var services = angular.module('Todo.services');
services.factory('companyService', ['$http', 'serviceHelper', function ($http, serviceHelper) {
    'use strict';

    var baseUrl = config.apiurl;
    var buildUrl = function (resourceUrl) {
        return baseUrl + resourceUrl;
    };

    return {
        getAll: function () {
            return $http.get(buildUrl('company/'));
        },
        getByRuc: function(ruc) {
            return $http.get(buildUrl('company/ruc/'+ ruc));
        },
        createCompany: function(company) {
            return $http.post(buildUrl('company/'), company);
        },
        updateCompany: function(company) {
            return $http.put(buildUrl('company'), company);
        }

    };
}]);