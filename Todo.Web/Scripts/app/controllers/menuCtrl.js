var controllers = angular.module('Todo.controllers');
controllers.controller('menuController', ['$scope', '$rootScope', '$location', 'navigate', function ($scope, $rootScope, $location, navigate) {
    'use strict';

    $scope.activeAdmin = false;
    $scope.activeCircuit = false;
    $scope.activeDashboard = false;
    $scope.activeTriaje = false;
    $scope.activeAdmision = false;
    $scope.activeAgenda = false;
    $scope.activeConfig = true;

    var disableMenus = function () {
        $scope.disableAgenda = true;
        $scope.disableAdmision = true;
        $scope.disableTriaje = true;
        $scope.disableDashboard = true;
        $scope.disableCircuit = true;
        $scope.disableAdmin = true;
        $scope.disableConfig = true;

        if ($rootScope.user === null) {
            return;
        }

        var roles = $rootScope.user.roles;
        if (_.contains(roles, "Config")) {
            $scope.disableConfig = false;
        }
        if (_.contains(roles, "AdministrativoEmpresas")) {
            $scope.disableAdmin = false;
        }
        if (_.contains(roles, "AdministrativoProtocolos")) {
            $scope.disableAdmin = false;
        }
        if (_.contains(roles, "Agenda")) {
            $scope.disableAgenda = false;
        }
        if (_.contains(roles, "Admisión")) {
            $scope.disableAdmision = false;
        }
        if (_.contains(roles, "Triaje")) {
            $scope.disableTriaje = false;
        }
        if (_.contains(roles, "Dashboard")) {
            $scope.disableDashboard = false;
        }
        if (_.contains(roles, "Circuito")) {
            $scope.disableCircuit = false;
        }

    };

    disableMenus();

    $scope.$watch('$rootScope.user', function () {
        disableMenus();
    });

    $scope.$on('rolesUpdated', function () {
        disableMenus();
    });

    $scope.$on('navigateToCircuit', function () {
        if ($scope.disableCircuit) {
            return;
        }
        $scope.activeAdmin = false;
        $scope.activeConfig = false;
        $scope.activeCircuit = true;
        $scope.activeDashboard = false;
        $scope.activeTriaje = false;
        $scope.activeAdmision = false;
        $scope.activeAgenda = false;
    });

    $scope.$on('navigateToDashboard', function () {
        if ($scope.disableDashboard) {
            return;
        }
        $scope.activeAdmin = false;
        $scope.activeConfig = false;
        $scope.activeCircuit = false;
        $scope.activeDashboard = true;
        $scope.activeTriaje = false;
        $scope.activeAdmision = false;
        $scope.activeAgenda = false;
    });
    
    $scope.admin = function () {
        if ($scope.disableAdmin) {
            return;
        }
        navigate.toAdmin();
        $scope.activeAdmin = true;
        $scope.activeConfig = false;
        $scope.activeCircuit = false;
        $scope.activeDashboard = false;
        $scope.activeTriaje = false;
        $scope.activeAdmision = false;
        $scope.activeAgenda = false;
    };
    $scope.circuit = function () {
        if ($scope.disableCircuit) {
            return;
        }
        navigate.toCircuit();
        $scope.activeAdmin = false;
        $scope.activeConfig = false;
        $scope.activeCircuit = true;
        $scope.activeDashboard = false;
        $scope.activeTriaje = false;
        $scope.activeAdmision = false;
        $scope.activeAgenda = false;
    };

    $scope.dashboard = function () {
        if ($scope.disableDashboard) {
            return;
        }
        navigate.toDashboard();
        $scope.activeAdmin = false;
        $scope.activeConfig = false;
        $scope.activeCircuit = false;
        $scope.activeDashboard = true;
        $scope.activeTriaje = false;
        $scope.activeAdmision = false;
        $scope.activeAgenda = false;

    };
    $scope.triaje = function () {
        if ($scope.disableTriaje) {
            return;
        }
        navigate.toTriaje();
        $scope.activeAdmin = false;
        $scope.activeConfig = false;
        $scope.activeCircuit = false;
        $scope.activeDashboard = false;
        $scope.activeTriaje = true;
        $scope.activeAdmision = false;
        $scope.activeAgenda = false;

    };
    $scope.admision = function () {
        if ($scope.disableAdmision) {
            return;
        }
        navigate.toAdmision();
        $scope.activeAdmin = false;
        $scope.activeConfig = false;
        $scope.activeCircuit = false;
        $scope.activeDashboard = false;
        $scope.activeTriaje = false;
        $scope.activeAdmision = true;
        $scope.activeAgenda = false;

    };
    $scope.agenda = function () {
        if ($scope.disableAgenda) {
            return;
        }
        navigate.toDay();
        $scope.activeAdmin = false;
        $scope.activeConfig = false;
        $scope.activeCircuit = false;
        $scope.activeDashboard = false;
        $scope.activeTriaje = false;
        $scope.activeAdmision = false;
        $scope.activeAgenda = true;

    };
    $scope.config = function () {
        if ($scope.disableConfig) {
            return;
        }
        navigate.toConfig();

        $scope.activeAdmin = false;
        $scope.activeConfig = true;
        $scope.activeConfig = false;
        $scope.activeCircuit = false;
        $scope.activeDashboard = false;
        $scope.activeTriaje = false;
        $scope.activeAdmision = false;
        $scope.activeAgenda = false;

    };
}]);
