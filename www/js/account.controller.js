/**
 * Created by areynolds on 11/16/2015.
 */
angular.module('app.controllers')

.controller('AccountController', ['$scope' , '$ionicPopup', 'ChartStore' , '$localstorage' , '$state' , function($scope, $ionicPopup, ChartStore, $localstorage, $state){


        $scope.showConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Warning',
                template: 'Are you sure you want to delete all of your charts? This action is not reversible'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    ChartStore.clearCharts();
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.logout = function(){
            $localstorage.remove('token');
            $state.go('login');
        }

    }]);