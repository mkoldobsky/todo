var app = angular.module('todo', ['ngRoute', 'ngAnimate', 'ngResource', 'ngCookies', 'ui.bootstrap', 'angucomplete-alt', 'toaster', 'multi-select', 'todo.controllers', 'todo.services', 'todo.directives']);
app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', function ($routeProvider, $locationProvider, $httpProvider, $provide) {
    'use strict';

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.useXDomain = true;
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/Login', { templateUrl: '/Views/shared/Login.html', controller: 'accountController' })
        .when('/Register', { templateUrl: '/Views/shared/Register.html', controller:'accountController' })
        .when('/Home', { templateUrl: '/Views/home/Home.html', controller: 'mainController' })
        .when('/Todo', { templateUrl: '/Views/Agenda/Todo.html', controller: 'todoController' })
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

    self.toTodo = function () {
        $location.path('Todo');
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
    } else {
        $location.url('/Login');
    }
    $rootScope.version = config.version;
    $rootScope.rev = config.rev;

});