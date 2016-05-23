angular.module('meetabroad.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopup, $timeout, auth, ApiData, $state, $ionicFilterBar) {

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

	$scope.toProfile = function(id) {
		$state.go('app.profile',{id: id});
	};

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

	$scope.loadSuggestions = function(user){

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
						s.loading = false;

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
					$scope.$broadcast('scroll.refreshComplete');

				}, function errorCallback(response){
					// We have our results already
					$scope.suggestions = suggestions;
					$scope.$broadcast('scroll.refreshComplete');
				}
			);
		});
    }

	auth.getUser().then(function(response){

		user = response.data;
		$scope.user = user;

		$scope.loadSuggestions(user);

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
})
.controller('MessageController', function($scope, $http, ApiData, auth, $ionicFilterBar) {
 

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
.controller('ConnectionsController', function($scope, $http, ApiData, auth, $ionicFilterBar) {

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

  })
