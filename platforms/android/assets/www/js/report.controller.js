/**
 * Created by areynolds on 10/26/2015.
 */


angular.module('app.controllers')

.controller('ReportController' , ['$scope', 'ApiRequests' , '$window', 'globals', '$localstorage', '$state' ,
        function($scope, ApiRequests,$window, globals, $localstorage, $state ){

        //TESTING
        $scope.alertMsg = "Report success!";


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

        $scope.backToReport = function(){
            $state.go('tab.run-report');
        };

        $scope.createNewChart = function(){
            console.log('into');
            $state.go('new-chart');
        };

        //Report Ready
        function pollSuccessFn(response){
            console.log('worked');

            $localstorage.setObject('current-report-data', response);

            console.log('data obj ' + $localstorage.getObject('current-report-data'));
            $scope.alertMsg = "Report success!";
            $scope.loading = false;
            $scope.pollSuccess = true;
        }
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
        function executeSuccessFn(response){
            $scope.executeMsg = "Report executed successfully, can now be polled";
            $scope.executeReportSuccess = true;

            var test = response.data && response.data.execute && response.data.execute.futureId;
            console.log(test);
            $localstorage.set('futureId', test );

            console.log($localstorage.get('futureId'));
        }
        function executeFailureFn(response){
            console.log(response.statusText);
            if( response.statusText == 'Bad Gateway'){
                $scope.executeMsg = 'Bad Gateway Error ! Server is currently down.';
            }
            if( response.data ){
                console.log(JSON.stringify(response.data,null,4));
            }
            $scope.notes = response.status;
        }

        function pollSuccess(response){
            $scope.poll = 'Poll success';
            console.log(JSON.stringify(response,null,4));
        }
    }]);