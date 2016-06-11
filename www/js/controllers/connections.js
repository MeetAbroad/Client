(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('ConnectionsController', function($scope, $http, ApiData, auth, $ionicFilterBar, NotificationService, $state) {
		$scope.$on('$ionicView.enter', function(e) {
		  $scope.connections = [];

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

	app.controller('ConnectionsPendingController', function($scope, $http, ApiData, auth, NotificationService) {

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
})();
