(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('LoginController', function($scope, $state, auth, $window) {
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
})();