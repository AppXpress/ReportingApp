/**
 * Created by areynolds on 10/27/2015.
 */

angular.module('app.controllers')

.controller('CompanyDataListController', ['$scope', '$ionicModal' ,'$localstorage', function($scope,$ionicModal,$localstorage){
        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(person) {
            console.log(JSON.stringify(person));
            var full_name = (person['First Name'] + " " + person['Last Name'])
            $scope.current_employee = {
                name : full_name,
                location : person.Name,
                department : person['Department Name'],
                startDate : person['Hire Date']
            };
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.current_employee = {
            name : null,
            location : null ,
            department : null ,
            startDate : null
        };
        console.log('company data init');
        $scope.companyData = $localstorage.getObject('current-report-data').data;

    }]);