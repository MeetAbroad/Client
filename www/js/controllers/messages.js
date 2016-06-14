(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('MessageController', function($scope, $http, ApiData, auth, $ionicFilterBar) {

    $scope.$on('$ionicView.enter', function(e) {
      $scope.listmessages = [];

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
              console.log("genero el ruben emilio luca desde 1");
              if(value.uid1.picture)
                value.pic = value.uid1.picture;
              else
                value.pic = '';

            }
            else
            {

              value.name = value.uid2.firstname + ' ' + value.uid2.lastname;
              console.log("genero el ruben emilio luca desde 2");

              if(value.uid2.picture)
                value.pic = value.uid2.picture;
              else
                value.pic = '';

            }

          });

        }, function(data){
          $scope.error = data;
          $scope.showAlert('No messages found', $scope.error.message);
          console.log('da error');
          $scope.listmessages = [];
        });

      });
    });




    $scope.showFilterBar = function () {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "<i class='ion-ios-close-outline'></i>",
        items: $scope.listmessages,
        update: function (filteredItems, filterText) {
          $scope.listmessages = filteredItems;
        }
      });
    };

	});

  app.controller('WriteMessageController', function($scope, $http, ApiData, auth, $stateParams, MessagesService, $ionicLoading, $window, $location) {


    $scope.chat = {};
    $scope.newMessage = {};

    function refreshMsgs(){
      auth.getUser().then(function successCallback(response) {
        var user = response.data;

        $http.get(ApiData.url+'/messages/mine/'+user._id+'/'+ $stateParams.id, {
          headers: {Authorization: 'Bearer '+auth.getToken()}
        }).then(function(response) {
          $scope.chats = response.data;

          if($scope.chats){
            $scope.newMessage.cid = $scope.chats[0].cid;
            $scope.newMessage.uid1 = $scope.chats[0].uid1._id;
            $scope.newMessage.uid2 = $scope.chats[0].uid2._id;
            if($scope.chats[0].uid1._id == user._id){
              $scope.newMessage.From = $scope.chats[0].uid1._id;
              $scope.newMessage.To = $scope.chats[0].uid2._id;
            }else{
              $scope.newMessage.From = $scope.chats[0].uid2._id;
              $scope.newMessage.To = $scope.chats[0].uid1._id;
            }
          }

          //Elegir picture
          angular.forEach($scope.chats, function(value, key) {

            /*if(value.uid1._id != user._id)
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

             }*/

            if(value.From != user._id)
            {
              value.mymessage = false;

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

            }
            else
            {

              value.mymessage = true;

              if(value.uid1._id != user._id)
              {
                value.name = value.uid2.firstname + ' ' + value.uid2.lastname;

                if(value.uid2.picture)
                  value.pic = value.uid2.picture;
                else
                  value.pic = '';

              }
              else
              {

                value.name = value.uid1.firstname + ' ' + value.uid1.lastname;

                if(value.uid1.picture)
                  value.pic = value.uid1.picture;
                else
                  value.pic = '';

              }

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
    }

    refreshMsgs();


    $scope.sendMessage = function(){

      console.log('este es el mensaje  q se enviiiaa::');
      console.log($scope.newMessage);

        MessagesService.newmessage($scope.newMessage).then(function successCallback(response){
        data = response.data;
          $scope.newMessage.message = '';
          refreshMsgs();
      });

    };


  });

  app.controller('WriteNewMessageController', function($scope, $http, ApiData, auth, $stateParams, MessagesService, $ionicLoading, $window, $state) {

    $scope.newMessageTo = {};

    auth.getUser().then(function successCallback(response) {
      var user = response.data;
      //$http.get(ApiData.url+'/messages/mine/'+user._id+'/'+ $stateParams.id, {
      $scope.newMessageTo.uid1 = user._id;
      $scope.newMessageTo.uid2 = $stateParams.id;
    });

    $scope.sendMessag = function(){

      MessagesService.newmessageto($scope.newMessageTo).error(function(data){
        $scope.error = data;
        $scope.showAlert('Error', $scope.error.message);
      }).then(function (){
        $scope.newMessageTo = {};
        $state.go('app.messages');
      });

    };


  });


})();
