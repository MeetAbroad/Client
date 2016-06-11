(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('MessageController', function($scope, $http, ApiData, auth, $ionicFilterBar) {
		//$scope.places = [{name:'New York'}, {name: 'London'}, {name: 'Milan'}, {name:'Paris'}];
		$scope.listmessages = [];
    $scope.listchats = [];

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

		  $http.get(ApiData.url+'/messages/'+user._id, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		  }).then(function(response) {
			data = response.data;
        $scope.listmessages = data;

        //Hacer mini arrays
        angular.forEach($scope.listmessages, function(value, key) {

          if(value.uid1._id != user._id)
          {
            console.log('primer if');

            //$scope.listchats.push(value);
            /*angular.forEach($scope.listchats, function(value2, key2) {
              console.log('entro al 2ndo foreach');
            });*/
            // If uid1 is not us, then we want this one
            //value.pic = value.uid1.picture;
            value.pic = 'test';

          }
          else
          {
            // Otherwise we want uid2
            //value.pic = value.uid2.picture;
            //console.log('primer else');
            //console.log($scope.listchats.length);
            if($scope.listchats.length == 0){
              console.log('HAGO UN PUSHHHH de:');
              console.log(value.uid2._id);
              $scope.listchats.push(value);}
            //var valor = value;
            //console.log('este es el valor::::::');
            //console.log(valor);
            else{
            /*  var a = 0;
            angular.forEach($scope.listchats, function(value3, key3) {
              console.log('__________________##############');
              console.log('MUESTRO VALUE');
              console.log(value.uid2._id);
              console.log('MUESTRO VALUE3');
              console.log(value3.uid2._id);
              console.log(value3.uid2._id != value.uid2._id);
              console.log('##############__________________');
              //if(JSON.stringify(value3) != JSON.stringify(valor))
              //if(value3.uid2._id != value.uid2._id){
              if(value.uid2._id != value3.uid2._id){
                console.log('Hago push de (estoy dentro del if):');
                console.log(value.uid2._id);
                $scope.listchats.push(value);
              }
              console.log('##############__________________');
            });*/
              //console.log($scope.listchats);

              /* intento 2
              console.log('POSITIONS deberia ser 0:');
              console.log(positions);
              var positions = [];

              for (var i=0; i<$scope.listchats.length; i++) {
                console.log('entro al for');
                console.log('el value1:');
                console.log(value.uid2._id);
                console.log('el value2:');
                console.log($scope.listchats[i].uid2._id);
                if(value.uid2._id != $scope.listchats[i].uid2._id)
                  positions.push(i);
              }

              angular.forEach(positions, function(inse, key4) {
                $scope.listchats.push(inse);
              });

              //positions = [];

              console.log('POSITIONS: no deberia ser 0');
              console.log(positions); */


              //intento 3

              var igual = 0;
              for (var i=0; i<$scope.listchats.length; i++) {
                if(value.uid2._id == $scope.listchats[i].uid2._id){
                  igual = 1;
                }
              }

              if(igual == false){
                $scope.listchats.push(value);
              }
            }

            value.pic = 'test';

          }

        });

        console.log('la lista de mensajes:');
        console.log($scope.listmessages);
        console.log('la lista de chats:');
        console.log($scope.listchats);


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
