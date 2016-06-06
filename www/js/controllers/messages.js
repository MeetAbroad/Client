(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('MessageController', function($scope, $http, ApiData, auth, $ionicFilterBar) {
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
	});
	
	app.controller('WriteMessageController', function($scope, $http, ApiData, auth, $ionicFilterBar) {
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
	});
})();