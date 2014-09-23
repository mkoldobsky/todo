var services = angular.module('Todo.services');
services.factory('agendaService', ['$http', 'serviceHelper', function ($http, serviceHelper) {
    'use strict';
    
    var baseUrl = config.apiurl;
    var buildUrl = function (resourceUrl) {
        return baseUrl + resourceUrl;
    };

    return {
        getDate: function (date) {
            return $http.get(buildUrl('agenda/') + date);
        },
        getWeek: function (day, month, year) {
            return $http.get(buildUrl('agenda/week/') + day + '/' + month + '/' + year);
        },
        getMonth: function (month, year) {
            return $http.get(buildUrl('agenda/month/') + month + '/' + year);
        },
        updateCapacity: function (id, capacity) {
            return $http.put(buildUrl('agenda/schedule/'), { id: id, capacity: capacity,
                headers: { 'Content-Type': 'application/json' }
                });
        },
        createProspect: function (prospect) {
            return $http.post(buildUrl('agenda/prospect'), prospect);
        },
        updateProspect: function (prospect) {
            return $http.put(buildUrl('agenda/prospect'), prospect);
        },
        createSchedule: function (schedule) {
            return $http.post(buildUrl('agenda/schedule'), schedule);
        },
        deleteProspect: function (prospect) {
            return $http.delete(buildUrl('agenda/prospect'), {
                data: { id: prospect.id },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };
}]);