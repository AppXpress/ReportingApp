/**
 * Created by areynolds on 11/2/2015.
 */

angular.module('app.controllers')

.controller('NewChartController', [ '$scope', 'ChartingDataService' ,'$state', '$ionicScrollDelegate' , function($scope, ChartingDataService,$state, $ionicScrollDelegate) {
        var defaultForm = {
            color: '#1B365B',
            kind : 'bar'
        };
        $scope.refreshPage = false;

        $scope.$watch( function(){
                return $scope.refreshPage;
            } , function(){
                console.log('watching');
                $ionicScrollDelegate.scrollTop();
                $scope.chart = angular.copy(defaultForm);
            }
        );



        $scope.dataSetOptions = [
            {
                value: 'peoplePerLocation',
                label: 'Number of People by Location'
            },
            {
                value: 'peoplePerDepartment',
                label: 'Number of People by Department'
            },
            {
                value: 'peopleByDepartmentPerLocation',
                label: 'Number of Departments by Location'
            },
            {
                value: 'peopleOverTime',
                label: 'Employees over Time'
            }
        ];

        $scope.chart = angular.copy(defaultForm);

        $scope.chartKindSet = function(type){
            if( type === 'peopleOverTime'){
                $scope.chart.kind = 'line';
                return true;
            }
            else if ( type === 'peopleByDepartmentPerLocation'){
                $scope.chart.kind = 'bar';
                return true;
            }
            else{
                if($scope.chart.kind == 'line'){
                    setTimeout(function(){
                        $scope.$apply(function(){
                            $scope.chart.kind = 'bar';
                        })
                    },10);
                }
                return false;
            }
        }

        $scope.generateReport = function (chart) {
            if( ! chart.type ){
                alert('need type of chart');
                return;
            }
            $scope.refreshPage = ! $scope.refreshPage;
            //Generate report data->
            var chart = ChartingDataService.create(chart);
            //Send data to chart screen

            $state.go('view-chart', {chartId: chart.id});

        }
    }]);