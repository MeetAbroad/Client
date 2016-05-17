angular.module('meetabroad.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, auth) {

	$scope.logOut = auth.logOut;
	$scope.loggedIn = auth.isLoggedIn;

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})

.controller('LoginController', function($scope, $state, auth, $ionicPopup, $timeout, $window) {
    $scope.user = {};

	// An alert dialog
	var showAlert = function(message) {
		var alertPopup = $ionicPopup.alert({
			title: 'Error',
			template: message,
		});
	};
	
    $scope.logIn = function(){
      auth.logIn($scope.user).error(function(data){
        $scope.error = data;

		showAlert($scope.error.message);
		  
      }).then(function(){
		  
		$scope.user = {};
		
		$window.location.reload(true);
      });
    };

})

.controller('InterestsController', function($scope, $http, ApiData) {
	$scope.interests = [];

	$http.get(ApiData.url+'/interests'/*, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	}*/).then(function(response){
		data = response.data;

		$scope.interests = data;
	});
})
