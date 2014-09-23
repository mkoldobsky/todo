var services = angular.module('Todo.services');
services.factory('patientService', ['$http', 'serviceHelper', function ($http, serviceHelper) {
    'use strict';

    var baseUrl = config.apiurl;
    var buildUrl = function (resourceUrl) {
        return baseUrl + resourceUrl;
    };

    return {
        createPatient: function (patient) {
            return $http.post(buildUrl('patient/'), patient);
        },
        getByDocument: function (document) {
            return $http.get(buildUrl('patient/document/' + document.type + '/' + document.number));
        },
        verifyAndCreateProtocol: function (editedProtocol) {
            return $http.post(buildUrl('protocol/edited/'), editedProtocol);
        },
        getWaybill: function (patientId, date) {
            return $http.get(buildUrl("patient/waybill/" + patientId + '/' + date));
        },
        getDashboardPatients: function () {
            return $http.get(buildUrl("patient/dashboard"));
        },
        getStationExamsByDocument: function(documentType, documentNumber, practiceId) {
            return $http.get(buildUrl("patient/exams/"+ documentType + '/' + documentNumber + '/' + practiceId));
        },
        createTriaje: function (triaje) {
            return $http.post(buildUrl('patient/triaje/'), triaje);
        },
        createAdmision: function (admision) {

            return $http.post(buildUrl('patient/admision/'), admision);
        }

    };
}]);