var app = angular.module('Todo', ['ngRoute', 'ngAnimate', 'ngResource', 'ngCookies', 'ui.bootstrap', 'angucomplete-alt', 'toaster', 'multi-select', 'Todo.controllers', 'Todo.services', 'Todo.directives']);
app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', function ($routeProvider, $locationProvider, $httpProvider, $provide) {
    'use strict';

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.useXDomain = true;
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/Login', { templateUrl: '/Views/shared/Login.html', controller: 'accountController' })
        .when('/Register', { templateUrl: '/Views/shared/Register.html' })
        .when('/Home', { templateUrl: '/Views/home/Home.html', controller: 'mainController' })
        .when('/Admin', { templateUrl: 'Views/Admin/Admin.html', controller: 'configController' })
        .when('/Config', { templateUrl: '/Views/Admin/Config.html', controller: 'configController' })
        .when('/Admision', { templateUrl: '/Views/Admision/Admision.html', controller: 'patientController' })
        .when('/Waybill/:id', { templateUrl: '/Views/Admision/Hoja-ruta.html', controllers: 'waybillController' })
        .when('/Triaje', { templateUrl: '/Views/Admision/Triaje.html', controller: 'patientController' })
        .when('/Agenda', { templateUrl: '/Views/Agenda/Agenda.html', controller: 'agendaController' })
        .when('/Circuit/:patientId/:examId/:practiceId', { templateUrl: '/Views/Circuit/Circuit.html', controller: 'circuitController' })
        .when('/Circuit', { templateUrl: '/Views/Circuit/Circuit.html', controller: 'circuitController' })
        .when('/Dashboard', { templateUrl: '/views/Dashboard/Dashboard.html', controller: 'dashboardController' })
        .when('/Error', { templateUrl: '/Views/shared/Error.html' })
        .otherwise({
            redirectTo: '/Login'
        });

    $httpProvider.interceptors.push('authorizationInterceptor');
    //$httpProvider.interceptors.push('httpInterceptor');
    moment.lang('es');
}]);
app.service('navigate', function ($location) {
    'use strict';

    var self = this;

    self.toAdmin = function () {
        $location.path('Admin');
    };
    self.toConfig = function() {
        $location.path('Config');
    };
    self.toAdmision = function () {
        $location.path('Admision');
    };
    self.toDay = function (day) {
        $location.path('Agenda');
    };
    self.toCircuit = function() {
        $location.path('Circuit');
    };
    self.toCircuitPatient = function (patientId, examId, practiceId) {
        $location.path('Circuit/' + patientId + '/' + examId + '/' + practiceId);
    };
    self.toDashboard = function () {
        $location.path('Dashboard');
    };
    self.toTriaje = function () {
        $location.path('Triaje');
    };
    self.toWaybill = function (patientId) {
        $location.path('Waybill/' + patientId);
    };
});
app.run(function run($http, $window, $rootScope, $location) {
    if ($location.url() == '/Login') {
        delete $window.sessionStorage.user;
    }
    var user = $window.sessionStorage.getItem("user");
    $rootScope.user = angular.fromJson(user);
    console.log($rootScope.user);
    $rootScope.currentTime = new Date();
    if ($rootScope.user != null) {
        if ($rootScope.user.access_token != undefined) {
            $http.defaults.headers.common.Authorization = "Bearer " + $rootScope.user.access_token;
        }
        //$location.url('/Home');

    } else {
        $location.url('/Login');
    }
    $rootScope.version = config.version;
    $rootScope.rev = config.rev;

});