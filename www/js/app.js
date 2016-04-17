// MeetAbroad

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'meetabroad' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'meetabroad.controllers' is found in controllers.js
angular.module('meetabroad', ['ionic', 'meetabroad.controllers'])

.run(function($ionicPlatform) {
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
});

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
		}
	})
	.state('app.search', {
		url: '/search',
		views: {
			'menuContent': {
				templateUrl: 'templates/search.html'
			}
		}
	})
	.state('app.messages', {
		url: '/messages',
		views: {
		'menuContent': {
			templateUrl: 'templates/messages.html'
			}
		}
	})
	.state('app.connections', {
		url: '/connections',
		views: {
		'menuContent': {
			templateUrl: 'templates/connections.html'
			}
		}
	})
    .state('app.interests', {
		url: '/interests',
      views: {
        'menuContent': {
          templateUrl: 'templates/interests.html',
          controller: 'InterestsController'
        }
      }
    })
	.state('app.options', {
		url: '/options',
		views: {
		'menuContent': {
			templateUrl: 'templates/options.html'
			}
		}
	})
	.state('app.profile', {
		url: '/profile',
		views: {
		'menuContent': {
			templateUrl: 'templates/profile.html'
			}
		}
	});
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/browse');
});
