/**
 * Created by areynolds on 10/26/2015.
 */


angular.module('app.controllers')

.controller('ReportController' , ['$scope', 'ApiRequests' , '$localstorage', '$state' ,
        function($scope, ApiRequests, $localstorage, $state ){

        //TESTING
        //$scope.alertMsg = "Report success!";


        $scope.runReport = function(){
            ApiRequests.executeReport(executeSuccessFn, executeFailureFn);
        };

        $scope.reportSuccess = function(){
            return $scope.alertMsg === "Report success!";
        };

        $scope.pollReport = function(){
            $scope.loading = true;
            $scope.alertMsg = null;
            var promise = ApiRequests.pollReport( $localstorage.get('futureId') );
            promise.then( pollSuccessFn, handleNoReportFn );
        };

        $scope.createNewChart = function(){
            $state.go('new-chart');
        };

        /////////////////////////////////////////////////////////////////////////////////////////////
            // Call Back Methods from REST Requests
        /////////////////////////////////////////////////////////////////////////////////////////////

        //Poll Success
        function pollSuccessFn(response){
            console.log('worked');

            $localstorage.setObject('current-report-data', response);

            console.log('data obj ' + $localstorage.getObject('current-report-data'));
            $scope.alertMsg = "Report success!";
            $scope.loading = false;
            $scope.pollSuccess = true;
        }
        //Poll Failure
        function handleNoReportFn(response){
            if( response.readyState){
                $scope.alertMsg = "Your report is still being created and thus cannot yet be " +
                        "polled. Please wait a few seconds and try again!";
            }
            else if( response.error ){
                $scope.alertMsg = response.error;
            }
            else{                 
                $scope.alertMsg = JSON.stringify(response,null,4);
            }
            $scope.loading = false;
        }
        //Execute Success
        function executeSuccessFn(response){
            $scope.executeMsg = "Report executed successfully, can now be polled";
            $scope.executeReportSuccess = true;

            var test = response.data && response.data.execute && response.data.execute.futureId;
            console.log(test);
            $localstorage.set('futureId', test );

            console.log($localstorage.get('futureId'));
        }
        //Execute Failure
        function executeFailureFn(response){
            console.log(response.statusText);
            if( response.statusText == 'Bad Gateway'){
                $scope.executeMsg = 'Bad Gateway Error ! Server is currently down.';
            }
            if( response.status == 401 ){
                $scope.executeMsg = "Unable to authenticate. Token expired or password changed. Please logout of app and then log back in to reautheticate. Log out from the Account Tab";
            }
            else{
                $scope.executeMsg = 'REST Call failed with -> ' + response.statusText;
            }

            if( response.data ){
                console.log(JSON.stringify(response.data,null,4));
            }
        }
    }]);