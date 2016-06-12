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
              value.pic = '';

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

		  }, function(data){
        $scope.error = data;
        $scope.showAlert('Error', $scope.error.message);
        console.log('da error');
  			$scope.listmessages = [];
		  });

		});

		// /profile/:id
	});

  app.controller('WriteMessageController', function($scope, $http, ApiData, auth, $stateParams) {


    $scope.chat = {};

    auth.getUser().then(function successCallback(response) {
      var user = response.data;

      $http.get(ApiData.url+'/messages/mine/'+user._id+'/'+ $stateParams.id, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).then(function(response) {
        $scope.chats = response.data;



        //Elegir picture
        angular.forEach($scope.chats, function(value, key) {

          if(value.uid1._id != user._id)
          {

            value.name = value.uid1.firstname + ' ' + value.uid1.lastname;



            if(value.uid1.picture)
              value.pic = value.uid1.picture;
            else
              value.pic = '';

          }
          else
          {

            value.name = value.uid2.firstname + ' ' + value.uid2.lastname;

            if(value.uid2.picture)
              value.pic = value.uid2.picture;
            else
              value.pic = '';

          }

          if(value.From != user._id)
          {
              value.mymessage = false;

          }
          else
          {

              value.mymessage = true;

          }

        });

        console.log('Obtengo esto:::::::');
        console.log($scope.chats);

      }, function(data){
        $scope.error = data;
        $scope.showAlert('Error', $scope.error.message);
        console.log('da error');
        $scope.chats = {};
      });

    });


  });

})();
