(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('MessageController', function($scope, $http, ApiData, auth, $ionicFilterBar) {
		//$scope.places = [{name:'New York'}, {name: 'London'}, {name: 'Milan'}, {name:'Paris'}];

		$scope.listmessages = [];

		$scope.showFilterBar = function () {
		  var filterBarInstance = $ionicFilterBar.show({
			cancelText: "<i class='ion-ios-close-outline'></i>",
			items: $scope.listmessages,
			update: function (filteredItems, filterText) {
			  $scope.listmessages = filteredItems;
			}
		  });
		};

		auth.getUser().then(function successCallback(response) {
		  var user = response.data;

		  $http.get(ApiData.url+'/messages/list/'+user._id, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		  }).then(function(response) {
			data = response.data;
        $scope.listmessages = data;
        console.log(data);
        //Elegir picture
        angular.forEach($scope.listmessages, function(value, key) {

          if(value.uid1._id != user._id)
          {

            value.name = value.uid1.firstname + ' ' + value.uid1.lastname;

            if(value.uid1.picture)
              value.pic = value.uid1.picture;
            else
              valie.pic = '';

          }
          else
          {

            value.name = value.uid2.firstname + ' ' + value.uid2.lastname;

            if(value.uid2.picture)
             value.pic = value.uid2.picture;
            else
              value.pic = '';

          }

        });

		  }, function(response){
			// Error -> let's assume it's empty
        console.log('da error');
			$scope.listmessages = [];
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
