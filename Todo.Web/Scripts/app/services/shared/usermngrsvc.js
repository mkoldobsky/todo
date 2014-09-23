var services = angular.module('Todo.services');
services.factory('userMngrSvc', ['$http', 'serviceHelper', function ($http, serviceHelper) {

    'use strict';
    
    var Token = serviceHelper.AuthorizationToken;
    var Account = serviceHelper.Account;

    var buildFormData = function (formData) {
        var dataString = '';
        for (var prop in formData) {
            if (formData.hasOwnProperty(prop)) {
                dataString += (prop + '=' + formData[prop] + '&');
            }
        }
        return dataString.slice(0, dataString.length - 1);
    };

    var baseUrl = config.apiurl;
    var buildUrl = function (resourceUrl) {
        return baseUrl + resourceUrl;
    };

    return {
        login: function(userLogin) {
            var formData = { username: userLogin.username, password: userLogin.password, isPersistent: userLogin.isPersistent, grant_type: 'password' };
            return Token.requestToken(buildFormData(formData), function(data) {
                $http.defaults.headers.common.Authorization = "Bearer " + data.access_token;
            });
        },
        getUsers: function() {
            return Account.get();
        },
        getActiveUsers: function() {
            return $http.get(buildUrl('account/active/'));
        },
        getRoles: function(userId) {
            return $http.get(buildUrl('account/roles/' + userId));
        },
        getStations: function(userId) {
            return $http.get(buildUrl('account/stations/' + userId));
        },
        updateUser: function(user) {
            return $http.put(buildUrl('account/'), user);
        },
        changePassword: function (username, currentPassword, newPassword) {
            var user = { username: username, currentPassword: currentPassword, newPassword: newPassword };
            console.log(user);
            return $http.put(buildUrl('account/newpassword/'), user);
        },
        registerUser: function (userRegistration) {
            var registration = Account.register(userRegistration);
            return registration;
        },
        logOffUser: function () {
            $http.defaults.headers.common.Authorization = null;
        }
    };
}]);