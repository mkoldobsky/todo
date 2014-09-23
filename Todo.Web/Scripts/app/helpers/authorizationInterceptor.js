(function () {
    'use strict';
    
    var services = angular.module('Todo.services', []);
    services.factory('authorizationInterceptor', ['$rootScope', '$q', '$location', function ($rootScope, $q, $location) {
        return {
            responseError: function (rejection) {
                switch (rejection.status) {
                case 401:
                    $rootScope.user = null;
                    $rootScope.$broadcast('logOff');
                    $location.url('/Login');
                    break;
                case 403:
                    $location.url('/Login');
                    break;
                default:
                    break;
                }

                return $q.reject(rejection);
            }
        };
    }]);

}());
