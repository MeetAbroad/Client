(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('InterestsController', function($scope, $http, ApiData, auth) {
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
})();