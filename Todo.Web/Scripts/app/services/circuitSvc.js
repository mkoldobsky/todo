var services = angular.module('Todo.services');
services.factory('circuitService', ['$http', 'serviceHelper', function ($http, serviceHelper) {
    'use strict';

    var baseUrl = config.apiurl;
    var buildUrl = function (resourceUrl) {
        return baseUrl + resourceUrl;
    };

    return {
        getPractices: function () {
            return $http.get(buildUrl("circuit/practices"));
        },
        getStationInfo: function (station) {
            return $http.get(buildUrl('circuit/station/' + station.patientId + '/' + station.examId + '/' + station.practiceId));
        },
        startPractice: function (station) {
            console.log(station);
            return $http.put(buildUrl('circuit/station/' + station.patient.id + '/' + station.examPatientId + '/' + station.practice.id));
        },
        revertPracticeStatus: function (station) {
            return $http.put(buildUrl('circuit/station/revert/' + station.examPatientId + '/' + station.practice.id));
        },
        saveForm: function (station) {
            var data = { examPatientId: station.examPatientId, formName: station.practice.name, values: station.selectedForm.data };
            return $http.post(buildUrl('circuit/form/'), data);
        },
        finishPractice: function (station) {
            return $http.put(buildUrl('circuit/station/' + station.patient.id + '/' + station.examPatientId + '/' + station.practice.id));
        },
        closeForm: function (station) {
            return $http.put(buildUrl('circuit/close-form/' + station.patient.id + '/' + station.examPatientId + '/' + station.practice.id));
        },
        validateForm: function (station) {
            console.log(station.selectedForm.data);
            return $http.get(buildUrl('circuit/validate/'), {
                data: { formName: station.practice.name, values: station.selectedForm.data },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
}]);