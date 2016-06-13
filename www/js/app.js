// MeetAbroad

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'meetabroad' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'meetabroad.controllers' is found in controllers.js
angular.module('meetabroad', ['ionic', 'meetabroad.controllers', 'jett.ionic.filter.bar', 'ngOpenFB'])

  .run(function($ionicPlatform, ngFB) {

    ngFB.init({appId: '229432347420669'});

    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .factory('ApiData', function() {
    return {
      url : 'http://localhost:3000'
    };
  })

  .factory('NotificationService', function($http, ApiData, auth) {

    var notifications = {total: 0};

    notifications.load = function() {
      return $http.get(ApiData.url + '/notifications/total', {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      }).then(function (response) {
        data = response.data;

        notifications.total = data;

        return notifications.total;
      });
    };

    return notifications;
  })

  .factory('MessagesService', function($http, ApiData, $window, $state) {

    var MessagesService = {};
    MessagesService.newmessage = function(message){
      return $http.post(ApiData.url+'/messages/message', message).success(function(data){
        console.log('Esty en newmessages');
      });
    };

    MessagesService.newmessageto = function(message){
      return $http.post(ApiData.url+'/messages/newmessage', message).success(function(data){
        $window.location.reload(true);
      });
    };

    return MessagesService;

  })

  .factory('auth', function($http, $window, $location, ApiData){
    var auth = {};

    auth.saveToken = function (token){
      $window.localStorage['meetabroad-token'] = token;
    };

    auth.getToken = function (){
      return $window.localStorage['meetabroad-token'];
    }

    auth.isLoggedIn = function(){
      var token = auth.getToken();

      if(token){

        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    auth.currentUser = function(){
      if(auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.email;
      }
    };

    auth.logIn = function(user){
      return $http.post(ApiData.url+'/login', user).success(function(data){
        auth.saveToken(data.token);
      });
    };

    auth.logOut = function(){
      $window.localStorage.removeItem('meetabroad-token');

      $window.location.reload(true);
    };

    auth.register = function(user){
      return $http.post(ApiData.url+'/register', user).success(function(data){
        auth.saveToken(data.token);
      });
    };

    auth.getUser = function(){
      return $http.get(ApiData.url+'/users/'+auth.currentUser(), {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      });
    };

    return auth;
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })
      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })

      /*** MESSAGES ***/
      .state('app.messages', {
        url: '/messages',
        views: {
          'menuContent': {
            templateUrl: 'templates/messages/list-messages.html',
            controller: 'MessageController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })
      .state('app.writemessage', {
        url: '/writemessage/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/messages/write-message.html',
            controller: 'WriteMessageController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })

      .state('app.newmessage', {
        url: '/newmessage/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/messages/new-message.html',
            controller: 'WriteNewMessageController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })


      .state('app.connections', {
        url: '/connections',
        views: {
          'menuContent': {
            templateUrl: 'templates/connections.html',
            controller: 'ConnectionsController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })
      .state('app.connections_pending', {
        url: '/connections/pending',
        views: {
          'menuContent': {
            templateUrl: 'templates/connections-pending.html',
            controller: 'ConnectionsPendingController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })
      .state('app.interests', {
        url: '/interests',
        views: {
          'menuContent': {
            templateUrl: 'templates/interests.html',
            controller: 'InterestsController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })
      .state('app.options', {
        url: '/options',
        views: {
          'menuContent': {
            templateUrl: 'templates/options.html',
            controller: 'OptionsController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })
      .state('app.profile', {
        url: '/profile/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })
      .state('app.myprofile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'MyProfileController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      })

      /*** Authentication ***/
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
          }
        },
        onEnter: function($state, auth){
          if(auth.isLoggedIn())
            $state.go('app.browse');
        }
      })

      /*** Registration ***/

      .state('app.reg', {
        url: '/reg',
        views: {
          'menuContent': {
            templateUrl: 'templates/register.html',
            controller: 'RegController'
          }
        },
        onEnter: function($state, auth){
          if(auth.isLoggedIn())
            $state.go('app.browse');
        }
      })

      /*** Finish Registration ***/
      .state('app.finishreg', {
        url: '/finishreg',
        views: {
          'menuContent': {
            templateUrl: 'templates/finishreg.html',
            controller: 'FinishregController'
          }
        },
        onEnter: function($state, auth){
          if(!auth.isLoggedIn())
            $state.go('app.login');
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
  });
