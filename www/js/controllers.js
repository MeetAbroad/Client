angular.module('meetabroad.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, auth, ApiData) {

	$scope.logOut = auth.logOut;
	$scope.loggedIn = auth.isLoggedIn;
	
	$scope.ApiUrl = ApiData.url;

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

.controller('BrowseController', function($scope, $http, ApiData, auth) {
	$scope.suggestions = [];
	
	auth.getUser().then(function(response){
		
		user = response.data;
		
		$http.get(ApiData.url+'/interests'/*, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}*/).then(function(response){
			data = response.data;

			$scope.interests = data;
		});
		
		// Make suggestions available to the whole app
		$http.get(ApiData.url+'/users/destinationcity/'+user.destinationcountry+'/'+user.destinationcity, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).then(function(response){
			
			suggestions = response.data;
			
			////// IMPORTANT: TODO this should probably be on the server-side...but meh...
			
			// Now get our connections so we can remove those users from this list
			$http.get(ApiData.url+'/connections/'+user._id, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).then(function successCallback(response){
					

					var connections = response.data;

					// Remove them
					for (var i = suggestions.length - 1; i >= 0; i--) {
						var s = suggestions[i];
						
						for (var j = connections.length - 1; j >= 0; j--) {
							var c = connections[j];

							if(
								(s._id == c.uid1 && c.uid2 == user._id)
								||
								(s._id == c.uid2 && c.uid1 == user._id)
							)
							{
								suggestions.splice(i, 1);
								break;
							}
						}
					}
					
					// We have our results now
					$scope.suggestions = suggestions;
					
				}, function errorCallback(response){
					// We have our results already
					$scope.suggestions = suggestions;
				}
			);
		});
	});
})
