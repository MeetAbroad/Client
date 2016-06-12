(function() {
  var app = angular.module('meetabroad.controllers');

  app.controller('ProfileController', function($scope, $http, ApiData, $stateParams) {

    $scope.profile = {};

    $http.get(ApiData.url+'/users/profile/' + $stateParams.id).then(function(res){
      $scope.profile = res.data;
    });
  });

  app.controller('MyProfileController', function($scope, $http, ApiData, auth) {

    $scope.profile = {};

    $http.get(ApiData.url+'/users/' + auth.currentUser()).then(function(res){
      $scope.profile = res.data;
    });
  })
})();
