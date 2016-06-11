(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('AppCtrl', function($scope, $ionicPopup, $timeout, auth, ApiData, $state, $ionicFilterBar, NotificationService, $interval) {

		$scope.logOut = auth.logOut;
		$scope.loggedIn = auth.isLoggedIn;

		$scope.ApiUrl = ApiData.url;

		// An alert dialog
		$scope.showAlert = function(title, message) {
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: message,
			});
		};

		if(auth.isLoggedIn())
		{
			$scope.toProfile = function(id) {
				$state.go('app.profile',{id: id});
			};

			$scope.refreshNotifications = function() {
			NotificationService.load().then(function (response) {
				$scope.notifications = response;
				});
			};
			$scope.refreshNotifications();

			// Set an interval for refreshing the main controller data (5s) (will only start in 5s, that's why we refresh first)
			$interval(function() {
				$scope.refreshNotifications();
			}, 10000);
		}

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});
	})
})();
