angular.module('meetabroad.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopup, $timeout, auth, ApiData, $state, $ionicFilterBar, NotificationService, $interval) {

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
		}, 5000);
	}

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});
})

.controller('LoginController', function($scope, $state, auth, $window) {
		$scope.user = {};

		$scope.logIn = function(){
			auth.logIn($scope.user).error(function(data){
				$scope.error = data;

		$scope.showAlert('Error', $scope.error.message);

			}).then(function(){

		$scope.user = {};

		$window.location.reload(true);
			});
		};
})

.controller('InterestsController', function($scope, $http, ApiData, auth) {
	$scope.interests = [];

	/*$http.get(ApiData.url+'/interests', {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	}).then(function(response){
		data = response.data;

		$scope.interests = data;
	});*/

	$scope.refreshInterests = function(){

		$scope.selected = {};

		// All interests
		$http.get(ApiData.url+'/interests').then(function(response){
			data = response.data;

			$scope.interests = data;
		});

		// Our interests
		$http.get(ApiData.url+'/interests/'+auth.currentUser(), {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).then(function(response){
			data = response.data;

			$scope.myinterests = data;

			// Update our 'selected' array
			var i;
			for(i=0; i<$scope.myinterests.length; i++)
			{
				$scope.selected[$scope.myinterests[i].codename] = true;
			}
		});
	};

	$scope.refreshInterests();

	// Check if it's in our interest list
	$scope.myInterest = function(interest){
		// If in array, then return true
		var i;
		for(i=0; i<this.myinterests.length; i++)
		{
			if (this.myinterests[i].codename == interest.codename)
			{
				return true;
			}
		}

		return false;
	};

	$scope.interestId = function(codename){

		// If in array, then return true
		var i;
		for(i=0; i<this.interests.length; i++)
		{
			if (this.interests[i].codename == codename)
			{
				return this.interests[i]._id;
			}
		}

		return false;
	};

	// Update our interests
	$scope.updateInterests = function(){

		var myinterests = [];

		angular.forEach($scope.selected, function(value, key) {

			if(value == true)
				myinterests.push($scope.interestId(key)); // store the _id
		});

		$http.post(ApiData.url+'/interests/update', {interests: myinterests}, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).then(function(response){
			data = response.data;

			// Refresh interests
			$scope.refreshInterests();

			$scope.showAlert('Updated', data.message);
		}, function(response){
			data = response.data;

			$scope.showAlert('Error', data);
		});
	};
})

.controller('ProfileController', function($scope, $http, ApiData, $stateParams) {

	$scope.profile = {};

	$http.get(ApiData.url+'/users/profile/' + $stateParams.id).then(function(res){
		$scope.profile = res.data;
	});
})

.controller('MyProfileController', function($scope, $http, ApiData, auth) {

	$scope.profile = {};

	$http.get(ApiData.url+'/users/' + auth.currentUser()).then(function(res){
		$scope.profile = res.data;
	});
})

.controller('BrowseController', function($scope, $http, ApiData, auth) {
	
	$scope.suggestions = [];

	$scope.hasMoreData = true;

	function loadSuggestions(params, callback){

		var user = params['user'];

		var data = '';
		if(params['notin'].length > 0)
		{
			var ampersand = '';
			for (var i=0; i < params['notin'].length; i++) {
				data += ampersand+'notin[]='+params['notin'][i];
				ampersand = '&';
			}
		}

		$http({
			url: ApiData.url+'/users/destinationcity/'+user.destinationcountry+'/'+user.destinationcity+'?'+data,
			method: 'GET',
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).then(function(response){

			suggestions = response.data;

			// We have our results now
			callback(suggestions);
		},function(response){
			// Nothing to retreive I suppose. ("no results found")
			callback(null);
		});
	};

	$scope.refreshSuggestions = function(user){
		var params = {};

		params['user'] = user;
		params['notin'] = [];

		loadSuggestions(params, function(suggestions){
			if(suggestions !== null)
			{
				$scope.hasMoreData = true;
				$scope.suggestions = suggestions;
			}
			else
				$scope.hasMoreData = false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.loadMoreSuggestions = function(user){
		var params = {};

		params['user'] = user;

		// Get the IDs of the existing suggestions into an array
		var ids = [];
		for (var i = $scope.suggestions.length - 1; i >= 0; i--) {
			ids.push($scope.suggestions[i]._id);
		}

		params['notin'] = ids;

		loadSuggestions(params, function(suggestions){
			if(suggestions !== null)
			{
				$scope.hasMoreData = true;
				$scope.suggestions = $scope.suggestions.concat(suggestions);
			}
			else
				$scope.hasMoreData = false;

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};
	
	$scope.$on('$ionicView.enter', function(e) {
		auth.getUser().then(function(response){

			user = response.data;
			$scope.user = user;

			var params = {};
			params['user'] = user;
			params['notin'] = [];

			loadSuggestions(params, function(suggestions){
				if(suggestions !== null)
					$scope.suggestions = $scope.suggestions.concat(suggestions);
			});

			// Send request
			$scope.sendRequest = function(id, index){

				$scope.suggestions[index].loading = 1;

				$http.post(ApiData.url+'/connections/new/'+id, user, {
					headers: {Authorization: 'Bearer '+auth.getToken()}
				}).then(function successCallback(response) {
					data = response.data;

					$scope.suggestions[index].loading = 2;

				}, function errorCallback(response) {
					data = response.data;

					$scope.showAlert('Error', data);

					$scope.suggestions[index].loading = 0;
				});
			};
		});
	});
})
.controller('MessageController', function($scope, $http, ApiData, auth, $ionicFilterBar) {
	//$scope.places = [{name:'New York'}, {name: 'London'}, {name: 'Milan'}, {name:'Paris'}];
	$scope.connections = [];

	$scope.showFilterBar = function () {
	  var filterBarInstance = $ionicFilterBar.show({
		cancelText: "<i class='ion-ios-close-outline'></i>",
		items: $scope.connections,
		update: function (filteredItems, filterText) {
		  $scope.connections = filteredItems;
		}
	  });
	};

	auth.getUser().then(function successCallback(response) {
	  var user = response.data;

	  $http.get(ApiData.url+'/connections/established/'+user._id, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).then(function(response) {
		data = response.data;

		$scope.connections = [];

		// Go through each connection and push it to the connections array, properly.
		angular.forEach(data, function(value, key) {

		  value.uid1.connectionid = value._id; // otherwise it gets lost when we push uid1 or uid2
		  value.uid2.connectionid = value._id; // otherwise it gets lost when we push uid1 or uid2

		  if(value.uid1._id != user._id)
		  {
			// If uid1 is not us, then we want this one
			$scope.connections.push(value.uid1);
		  }
		  else
		  {
			// Otherwise we want uid2
			$scope.connections.push(value.uid2);
		  }
		});
	  }, function(response){
		// Error -> let's assume it's empty
		$scope.connections = [];
	  });

	});

	// /profile/:id
})
.controller('WriteMessageController', function($scope, $http, ApiData, auth, $ionicFilterBar) {
	//$scope.places = [{name:'New York'}, {name: 'London'}, {name: 'Milan'}, {name:'Paris'}];
	$scope.connections = [];

	$scope.showFilterBar = function () {
	  var filterBarInstance = $ionicFilterBar.show({
		cancelText: "<i class='ion-ios-close-outline'></i>",
		items: $scope.connections,
		update: function (filteredItems, filterText) {
		  $scope.connections = filteredItems;
		}
	  });
	};

	auth.getUser().then(function successCallback(response) {
	  var user = response.data;

	  $http.get(ApiData.url+'/connections/established/'+user._id, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).then(function(response) {
		data = response.data;

		$scope.connections = [];

		// Go through each connection and push it to the connections array, properly.
		angular.forEach(data, function(value, key) {

		  value.uid1.connectionid = value._id; // otherwise it gets lost when we push uid1 or uid2
		  value.uid2.connectionid = value._id; // otherwise it gets lost when we push uid1 or uid2

		  if(value.uid1._id != user._id)
		  {
			// If uid1 is not us, then we want this one
			$scope.connections.push(value.uid1);
		  }
		  else
		  {
			// Otherwise we want uid2
			$scope.connections.push(value.uid2);
		  }
		});
	  }, function(response){
		// Error -> let's assume it's empty
		$scope.connections = [];
	  });

	});
	// /profile/:id
})
.controller('ConnectionsController', function($scope, $http, ApiData, auth, $ionicFilterBar, NotificationService, $state) {

	$scope.$on('$ionicView.enter', function(e) {
	  $scope.connections = [];

	  $scope.$on('$ionicView.enter', function(e) {
		// Refresh every time we enter this view
		auth.getUser().then(function successCallback(response) {
		  var user = response.data;

		  $scope.refreshConnections = function(){
			$http.get(ApiData.url+'/connections/established/'+user._id, {
			  headers: {Authorization: 'Bearer '+auth.getToken()}
			}).then(function(response) {
			  data = response.data;

			  $scope.connections = [];

			  // Go through each connection and push it to the connections array, properly.
			  angular.forEach(data, function(value, key) {

				value.uid1.connectionid = value._id; // otherwise it gets lost when we push uid1 or uid2
				value.uid2.connectionid = value._id; // otherwise it gets lost when we push uid1 or uid2

				if(value.uid1._id != user._id)
				{
				  // If uid1 is not us, then we want this one
				  $scope.connections.push(value.uid1);
				}
				else
				{
				  // Otherwise we want uid2
				  $scope.connections.push(value.uid2);
				}
			  });
			}, function(response){
			  // Error -> let's assume it's empty
			  $scope.connections = [];
			});
		  }
		  $scope.refreshConnections();

		  // Delete connection
		  $scope.deleteConnection = function(id){

			$http.post(ApiData.url+'/connections/delete/'+id, user, {
			  headers: {Authorization: 'Bearer '+auth.getToken()}
			}).then(function successCallback(response) {
			  data = response.data;

			  $scope.showAlert('Success', data);

			  $scope.refreshConnections();
			}, function errorCallback(response) {
			  data = response.data;
			  $scope.showAlert('Error rejecting', data);
			});
		  };
		});
	  });

	  $scope.showFilterBar = function () {
		var filterBarInstance = $ionicFilterBar.show({
		  cancelText: "Cancel",
		  items: $scope.connections,
		  update: function (filteredItems, filterText) {
			$scope.connections = filteredItems;
		  }
		});
	  };
	});
})
.controller('ConnectionsPendingController', function($scope, $http, ApiData, auth, NotificationService) {

  // Get user
  $scope.$on('$ionicView.enter', function(e) {
	  auth.getUser().then(function successCallback(response) {
		$scope.user = response.data;
		$scope.total = 0;

		function refreshRequests() {
		  $scope.total = 0;
		  $scope.connections = [];

		  $http.get(ApiData.url + '/notifications', {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		  }).then(function (response) {
			data = response.data;

			$scope.connections = data.notifications;
			$scope.total = data.total;
		  });
		}
		refreshRequests();

		// Accept request
		$scope.acceptRequest = function (id) {
		  $http.post(ApiData.url+'/connections/accept/' + id, $scope.user, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		  }).then(function successCallback(response) {
			data = response.data;

			$scope.showAlert('Success', data);

			refreshRequests();
			$scope.refreshNotifications();

		  }, function errorCallback(response) {
			data = response.data;
			$scope.showAlert('Error accepting', data);
		  });
		};

		// Reject request
		$scope.rejectRequest = function (id) {
		  $http.post(ApiData.url+'/connections/reject/' + id, $scope.user, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		  }).then(function successCallback(response) {
			data = response.data;

			$scope.showAlert('Success', data);

			refreshRequests();
			$scope.refreshNotifications();

		  }, function errorCallback(response) {
			data = response.data;
			$scope.showAlert('Error rejecting', data);
		  });
		};
	  });
  });
});
