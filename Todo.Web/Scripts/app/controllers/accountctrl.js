var controllers = angular.module('todo.controllers', []);
controllers.controller('accountController', ['$scope', '$rootScope', '$location', 'toaster', 'userMngrSvc', '$window', function ($scope, $rootScope, $location, toaster, userMngrSvc, $window) {
    "use strict";
    $scope.souldChangePassword = false;
    $scope.login = function (userLogin) {
        if (userLogin === undefined || (userLogin.username === '' || userLogin.password === '')) {
            toaster.pop('warning', 'Alerta!', 'El usuario o la contraseña no pueden ser nulos.');
            return;
        }
        $scope.errorMessage = '';
        userMngrSvc.login(userLogin).$promise
            .then(function (data) {
                var user = data;
            console.log(user);
                if (user.active == 'False') {
                    toaster.pop('error', 'Error', 'Usuario inactivo. Consulte con el administrador.');
                    return;
                }
                $scope.$emit('logOn');
                userMngrSvc.getRoles(data.id).then(function (result) {
                    user.roles = result.data.Result;
                    if (data.shouldChangePassword === 'True') {
                        toaster.pop("warning", "Alerta!", "Debe cambiar su contraseña.\nIngrese su nueva contraseña");
                        $scope.shouldChangePassword = true;
                        return;
                    } else {
                        $rootScope.user = user;
                        console.log(user);
                        $window.sessionStorage.setItem("user", JSON.stringify(user));
                        $rootScope.$broadcast('rolesUpdated');
                        if (_.contains(user.roles, "Circuito")) {
                            userMngrSvc.getStations(user.id).then(function (stations) {
                                user.stations = stations.data;
                                $rootScope.user = user;
                                delete $window.sessionStorage.user;
                                $window.sessionStorage.setItem("user", JSON.stringify(user));
                                console.log($rootScope.user);
                            });
                        }
                        $location.url('/Home');
                    }
                });
            }).catch(function (errorResponse) {
                delete $window.sessionStorage.access_token;
                delete $window.sessionStorage.username;
                if (errorResponse.status === 404) {
                    $scope.errorMessage = errorResponse.data;
                    toaster.pop('error', 'Error', errorResponse.data);
                }
                if (errorResponse.status === 400) {
                    $scope.errorMessage = "El usuario/contraseña no son válidos";
                    toaster.pop('error', 'Error', "El usuario/contraseña no son válidos");
                } else {
                    toaster.pop('error', 'Error', "Un error ocurrió. Repita la operación luego de un tiempo.");
                }
            });
    };

    $scope.changePassword = function (userLogin) {
        if (userLogin.newPassword !== userLogin.confirmNewPassword) {
            toaster.pop('error', 'Error', "Las contraseñas no coinciden.");
            return;
        }
        if (userLogin.newPassword === undefined && userLogin.confirmNewPassword === undefined) {
            toaster.pop('error', 'Error', 'La nueva contraseña no puede ser nula');
            return;
        }
        if (userLogin.newPassword === '' && userLogin.confirmNewPassword === '') {
            toaster.pop('error', 'Error', 'La nueva contraseña no puede ser nula');
            return;
        }
        var currentPassword = userLogin.password;
        userMngrSvc.changePassword(userLogin.username, currentPassword, userLogin.newPassword).then(function (result) {
            toaster.pop('info', 'Información', 'Contraseña actualizada correctamente.');
            userLogin.password = userLogin.newPassword;
            $scope.login(userLogin);
        }).catch(function (error) {
            toaster.pop('error', 'Error', error.data);
        });
    };

    $scope.register = function (userRegistration) {
        userMngrSvc.registerUser(userRegistration).$promise
            .then(function (data) {
                return userMngrSvc.login({ Email: userRegistration.email, Password: userRegistration.password }).$promise.then(function (data) {
                    $scope.$emit('logOn');
                    $location.url('/Home');
                });
            }).catch(function (error) {
                if (error.status === 400) {
                    $scope.errorMessage = "Email already exists.";
                    toaster.pop("error", "Error", "Email already exists.");
                } else {
                    $scope.errorMessage = "An error occured while performing this action. Please try after some time.";
                    toaster.pop('error', 'Error', "Un error ocurrió. Repita la operación luego de un tiempo.");
                }
            });
    };

    $scope.logOff = function () {
        userMngrSvc.logOffUser();
        $rootScope.user = undefined;
        delete $window.sessionStorage.user;
        $scope.$emit('logOff');
        $location.url('/Login');
    };
}]);