(function() {
    var app = angular.module('MeetAbroad', ['ui.router']);

    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('index', {
                    url: '/index',
                    templateUrl: './index-guest.html',
                    controller: 'HomeController'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: './login.html',
                    controller: 'UserController',
                })
                .state('register', {
                    url: '/register',
                    templateUrl: './register.html',
                    controller: 'UserController',
                });

            $urlRouterProvider.otherwise('index');
        }
    ]);

    app.controller('HomeController', ['$scope', '$http', function($scope, $http) {

    }]);

    app.controller('UserController', ['$scope', '$http', function($scope, $http) {

    }]);
})();