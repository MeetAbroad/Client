(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('BrowseController', function($scope, $http, ApiData, auth, $state) {

		function loadSuggestions(params, callback){

			var user = params['user'];

			var data = '';
			if(params['notin'].length > 0)
			{
				var ampersand = '';
				for (var i=0; i < params['notin'].length; i++) {
					data += ampersand+'notin[]='+params['notin'][i];
					ampersand = '&';
				}
			}

			$http({
				url: ApiData.url+'/users/destinationcity/'+user.destinationcountry+'/'+user.destinationcity+'?'+data,
				method: 'GET',
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).then(function(response){

				suggestions = response.data;

				// We have our results now
				callback(suggestions);
			},function(response){
				// Nothing to retreive I suppose. ("no results found")
				callback(null);
			});
		};

		$scope.refreshSuggestions = function(user){
			var params = {};

			params['user'] = user;
			params['notin'] = [];

			loadSuggestions(params, function(suggestions){
				if(suggestions !== null)
				{
					$scope.hasMoreData = true;
					$scope.suggestions = suggestions;
				}
				else
					$scope.hasMoreData = false;
				$scope.$broadcast('scroll.refreshComplete');
			});
		};

		$scope.loadMoreSuggestions = function(user){
			var params = {};

			params['user'] = user;

			// Get the IDs of the existing suggestions into an array
			var ids = [];
			for (var i = $scope.suggestions.length - 1; i >= 0; i--) {
				ids.push($scope.suggestions[i]._id);
			}

			params['notin'] = ids;

			loadSuggestions(params, function(suggestions){
				if(suggestions !== null)
				{
					$scope.hasMoreData = true;
					$scope.suggestions = $scope.suggestions.concat(suggestions);
				}
				else
					$scope.hasMoreData = false;

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};
		
		$scope.$on('$ionicView.enter', function(e) {
			$scope.suggestions = [];

			$scope.hasMoreData = true;
			
			auth.getUser().then(function(response){

				user = response.data;
				$scope.user = user;
				
				if(user.destinationcity == '__undefined__')
				{
					// Already finished...
					$state.go('app.finishreg');
				}
				else
				{
					var params = {};
					params['user'] = user;
					params['notin'] = [];

					loadSuggestions(params, function(suggestions){
						if(suggestions !== null)
							$scope.suggestions = $scope.suggestions.concat(suggestions);
					});

					// Send request
					$scope.sendRequest = function(id, index){

						$scope.suggestions[index].loading = 1;

						$http.post(ApiData.url+'/connections/new/'+id, user, {
							headers: {Authorization: 'Bearer '+auth.getToken()}
						}).then(function successCallback(response) {
							data = response.data;

							$scope.suggestions[index].loading = 2;

						}, function errorCallback(response) {
							data = response.data;

							$scope.showAlert('Error', data);

							$scope.suggestions[index].loading = 0;
						});
					};
				}
			});
		});
	})
})();