var controllers = angular.module('Todo.controllers');

controllers.controller('waybillController', ['$scope', '$rootScope', '$timeout', '$routeParams', 'navigate', 'toaster', 'patientService',
    function ($scope, $rootScope, $timeout, $routeParams, navigate, toaster, patientService) {
        'use strict';

        console.log($routeParams.id);
        var date = new Date();
        var shortDate =  date.getDate() + "-" +  date.getMonth() + "-" +  date.getFullYear();
        patientService.getWaybill($routeParams.id, shortDate).then(function (result) {
            console.log(result);
            $scope.waybill = result.data;
        });

        $scope.printWaybill = function (divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            var popupWin = window.open('', '_blank', 'width=600,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../Content/css/bootstrap.css" /><link rel="stylesheet" type="text/css" href="../Content/css/overrides.css" /></head><body onload="window.print()"><div class="container">' + printContents + '</div></html>');
            popupWin.document.close();
        };

    }]);
