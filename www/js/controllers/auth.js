(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('LoginController', function($scope, $state, auth, $window, ngFB, $ionicLoading, $http, ApiData) {
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
			
			$ionicLoading.show({
				template: 'Please wait...'
			});
			
			ngFB.login({scope: 'email,public_profile'}).then(
			function (response) {
				if (response.status === 'connected') {
					ngFB.api({
						path: '/me',
						params: {fields: 'id,first_name,gender,last_name,email,picture'}
					}).then(
						function (user) {
							user.access_token = response.authResponse.accessToken;
							$http.post(ApiData.url+'/mobile/facebook', user).success(function(data){
								auth.saveToken(data.token);
								$ionicLoading.hide();
								$window.location.reload(true);
							}).error(function(data){
								$ionicLoading.hide();
								$scope.showAlert('Error', data);
							});
						},
						function (error) {
							$ionicLoading.hide();
							$scope.showAlert('Facebook Error', error.error_description);
						}
					);
				} else {
					$ionicLoading.hide();
					$scope.showAlert('Facebook Error', 'Facebook login failed');
				}
			});
		};
	})
	
	app.controller('FinishregController', function($scope, $http, auth, $state, $ionicLoading, ApiData) {
		
		auth.getUser().then(function(response){
			
			user = response.data;
			$scope.user = user;
		
			if(user.destinationcity !== '__undefined__')
			{
				// Already finished...
				$state.go('app.browse');
			}
			
			$scope.user = user;
		
			// Erase our default fields
			$scope.user.destinationcity = '';
			$scope.user.destinationcountry = '';
			$scope.user.origincity = '';
			$scope.user.origincountry = '';
			$scope.user.age = '';
			$scope.user.gender = null;
			
			// Update our options
			$scope.updateOptions = function(){
				
				$ionicLoading.show({
					template: 'Please wait...'
				});
				
				$http.post(ApiData.url+'/users/update', $scope.user, {
					headers: {Authorization: 'Bearer '+auth.getToken()}
				}).then(function successCallback(response){
					data = response.data;
					
					$ionicLoading.hide();
					$state.go('app.browse');
					
				}, function errorCallback(response){
					data = response.data;
					$ionicLoading.hide();
					$scope.showAlert('Error', data);
				});
			};
		});
	});
})();