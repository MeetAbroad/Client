angular.module('meetabroad.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})

.controller('LoginController', function($scope, $state, auth) {
    $scope.user = {};

    $scope.logIn = function(){
      auth.logIn($scope.user).error(function(error){
        $scope.error = error;
          console.log("error en login");
          console.log($scope.error);
      }).then(function(){
        console.log("todo ha ido OK");
        $state.go('app.profile');
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
