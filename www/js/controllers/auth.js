(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('LoginController', function($scope, $state, auth, $window, ngFB) {
		$scope.user = {};

		$scope.logIn = function()
		{
			auth.logIn($scope.user).error(function(data){
				$scope.error = data;

				$scope.showAlert('Error', $scope.error.message);

			}).then(function(){

				$scope.user = {};

				$window.location.reload(true);
			})
		};
		
		$scope.fbLogin = function () {
			ngFB.login({scope: 'email,public_profile'}).then(
			function (response) {
				if (response.status === 'connected') {
					console.log('Facebook login succeeded');
					
					ngFB.api({
						path: '/me',
						params: {fields: 'id,first_name,gender,last_name,email,picture'}
					}).then(
						function (user) {
							console.log(user);
						},
						function (error) {
							alert('Facebook error: ' + error.error_description);
						}
					);
				} else {
					alert('Facebook login failed');
				}
			});
		};
	})
})();