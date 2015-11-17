/**
 * Created by areynolds on 10/22/2015.
 */

angular.module('app.controllers')

.controller('LoginController', ['$scope', 'ApiRequests', '$state','$q', '$localstorage', function($scope,ApiRequests, $state, $q, $localstorage){
        $scope.credentials= {};

        $scope.logInFn = function(user){
            $scope.isLoading = true;
            ApiRequests.login( user.username, user.password , loginSuccess, loginFailure);
        };

        function loginSuccess(response){
            var token = response.headers && response.headers.Authorization;
            $localstorage.set('token',token);
            console.log(response);
            console.log(response.data);
            $state.go('tab.run-report');
        }
        function loginFailure(response){
            console.log(response);
            $scope.showError = true;
            if(response.status == 401){
                $scope.errorMsg = "Incorrect credentials - try again or contact GTNexus";
            }
            else{
                $scope.errorMsg = 'Unknown Error - check network' + response.statusText;
            }
        }

    }]);
