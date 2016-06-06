(function() {
	var app = angular.module('meetabroad.controllers');

	app.controller('SearchController', function($scope, $http, ApiData, auth, $ionicLoading) {
		
		$scope.$on('$ionicView.enter', function(e) {
			$scope.searchForm = true;
			$scope.searchResults = false;
			$scope.searchLoading = false;
			
			$scope.selected = {};
			$scope.search = {};
			$scope.adsearch = {display: false};
			
			auth.getUser().then(function(response){
				user = response.data;
				$scope.user = user;
			});
		});
		
		$http.get(ApiData.url+'/interests').then(function(response){
			data = response.data;
			
			$scope.interests = data;
		});
		
		$scope.doSearch = function(){
			
			$ionicLoading.show({
				template: 'Searching...'
			});
			
			$scope.error = null;
			$scope.results = [];
			$scope.searchForm = false;
			$scope.searchLoading = true;
			
			if($scope.adsearch.display == true)
			{
				$scope.search = angular.extend({}, $scope.search, $scope.adsearch);
				
				// Advanced search
				$http.post(ApiData.url+'/search/advanced', $scope.search, {
					headers: {Authorization: 'Bearer '+auth.getToken()}
				}).then(function successCallback(response){
					$ionicLoading.hide();
					data = response.data;
					
					if(data.length == 0)
					{
						$scope.searchResults = false;
						$scope.searchLoading = false;
						$scope.searchForm = true;
						
						$scope.showAlert('Error', 'No results found.');
					}
					else
					{
						$scope.results = data;
						
						$scope.searchLoading = false;
						$scope.searchResults = true;
					}
					
				}, function errorCallback(response){
					
					$ionicLoading.hide();
					data = response.data;
					$scope.showAlert('Error', data);
					
					$scope.searchResults = false;
					$scope.searchLoading = false;
					$scope.searchForm = true;
				});
			}
			else
			{
				// Basic
				$http.post(ApiData.url+'/search/basic', $scope.search, {
					headers: {Authorization: 'Bearer '+auth.getToken()}
				}).then(function successCallback(response){
					
					$ionicLoading.hide();
					data = response.data;
					
					if(data.length == 0)
					{
						$scope.searchResults = false;
						$scope.searchLoading = false;
						$scope.searchForm = true;
						
						$scope.showAlert('Error', 'No results found.');
					}
					else
					{
						$scope.results = data;
						
						$scope.searchLoading = false;
						$scope.searchResults = true;
					}
					
				}, function errorCallback(response){
					
					$ionicLoading.hide();
					data = response.data;
					$scope.showAlert('Error', data);
					
					$scope.searchResults = false;
					$scope.searchLoading = false;
					$scope.searchForm = true;
				});
			}
		};
		
		$scope.resetSearch = function(){
			$scope.error = null;
			$scope.searchResults = false;
			$scope.searchLoading = false;
			$scope.searchForm = true;
			$scope.results = [];
		};
		
		// Send request
		$scope.sendRequest = function(id, index){
			$scope.results[index].loading = 1;

			$http.post(ApiData.url+'/connections/new/'+id, user, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).then(function successCallback(response) {
				data = response.data;

				$scope.results[index].loading = 2;

			}, function errorCallback(response) {
				data = response.data;

				$scope.showAlert('Error', data);

				$scope.results[index].loading = 0;
			});
		};
	})
})();