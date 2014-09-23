var controllers = angular.module('Todo.controllers');

controllers.controller('dashboardController', ['$scope', '$rootScope', '$timeout', 'toaster', 'navigate', 'patientService', function ($scope, $rootScope, $timeout, toaster, navigate, patientService) {
    "use strict";

    var getDashboardPatients = function () {
        patientService.getDashboardPatients().then(function (result) {
            $scope.patients = result.data;
            console.log($scope.patients);
            if ($rootScope.user.stations.selectedStation != 'Auditoría') {
                $scope.stationFiltered = _.filter(result.data, function(item) {
                    return _.where(item.practices, { name: $rootScope.user.stations.selectedStation }).length > 0;
                });
            } else {
                $scope.stationFiltered = _.where(result.data, {examStatus: 'Cerrado'}); 
            }
            filterList($scope.filter);
        });
    };

    var filterList = function() {
        var filter = $scope.filter;
        if (filter == undefined) {
            $scope.filteredPatients = $scope.allPatients ? $scope.patients : $scope.stationFiltered;
            return;
        }
        $scope.filteredPatients = _.where($scope.filteredPatients = $scope.allPatients ? $scope.patients : $scope.stationFiltered, { examStatus: filter.filter });
    }

    var updateDashboard = function () {
        getDashboardPatients();
        $timeout(updateDashboard, 10000);

    };


    var init = function () {
        $scope.statuses = [{ filter: 'No atendido', name: 'No Atendido' }, { filter: 'En Atención', name: 'En Atención' }];
        getDashboardPatients();
        updateDashboard();
    };

    init();

    $scope.filterList = function (filter) {
        filterList();
    };

    $scope.listChanged = function () {
        $scope.filteredPatients = $scope.allPatients ? $scope.patients : $scope.stationFiltered;
    };

    $scope.takePatient = function (patient, practice) {
        console.log(patient, practice);
        if ($rootScope.user === undefined) {
            return;
        }
        var roles = $rootScope.user.roles;
        if (!_.contains(roles, "Circuito")) {
            toaster.pop("warning", "Alerta", "No tiene permisos suficientes para tomar un paciente");
            return;
        }
        var stations = $rootScope.user.stations;
        if (!_.contains(stations.stations, practice.name)) {
            toaster.pop("warning", "Alerta", "No tiene permisos sobre esa práctica");
            return;
        }
        if (patient.examStatus === "Atendido") {
            toaster.pop("warning", "Alerta", "El paciente ya se encuentra en atención.");
            return;
        }
        if (patient.examStatus === "Completado") {
            toaster.pop("warning", "Alerta", "El paciente ya completó el examen preocupacional");
            return;
        }

        navigate.toCircuitPatient(patient.id, patient.examId, practice.id);
        $rootScope.$broadcast('navigateToCircuit');

    };

    $scope.auditPatient = function (patient, practice) {
        if ($rootScope.user === undefined) {
            return;
        }

        navigate.toCircuitPatient(patient.id, patient.examId, practice.id);
        $rootScope.$broadcast('navigateToCircuit');

    };
}]);
