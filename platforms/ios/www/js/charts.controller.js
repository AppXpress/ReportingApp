/**
 * Created by areynolds on 10/23/2015.
 */

angular.module('app.controllers')

.controller('ChartController',['$scope' , 'ChartStore', '$state' , '$ionicPopup' , function($scope,ChartStore, $state, $ionicPopup){

        $scope.myCharts = ChartStore.getAllCharts();

        $scope.$watch( function(){
            return ChartStore.getAllCharts();
        },function(newVal,oldVal){
            console.log('in watch');
            $scope.myCharts = ChartStore.getAllCharts();
        },true);

        $scope.data = {
            showDelete : false
        };

        $scope.sortCharts = function(chart) {
            var date = new Date(chart.dateCreated);
            return date;
        };


        $scope.viewChart = function(chart){
            $state.go('view-chart', { chartId : chart.id} );
        };

        $scope.showConfirm = function(chart) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure?',
                template: 'Are you sure you want to delete this chart?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $scope.myCharts.splice($scope.myCharts.indexOf(chart),1);
                    ChartStore.delete(chart.id);
                } else {
                    console.log('You are not sure');
                }
            });
            $scope.data.showDelete = false;
        };


    }])

.controller('IndividualChartController',[ '$stateParams' ,'$scope', 'ChartStore' , 'PieChart', 'BarChart', 'TimeSeriesChart', 'DonutChart', 'StackedChart',
    function($stateParams,$scope,ChartStore,PieChart,BarChart,TimeSeriesChart,DonutChart,StackedChart){

        $scope.global = "charts";

        var this_chart = ChartStore.getChart( $stateParams.chartId );
        if( ! this_chart){
            $scope.title = "Could not find chart -> " + $stateParams.chartId;
            return;
        }
        $scope.kind = this_chart.kind;

        console.log($scope.kind + "SCOPE>KIND");

        var myChart;
        if( this_chart.type == 'peopleByDepartmentPerLocation'){
            myChart = new StackedChart(this_chart);
        }
        else if( $scope.kind == 'bar'){
            myChart = new BarChart(this_chart);
        }
        else if($scope.kind == 'pie'){
            myChart = new PieChart(this_chart);
        }
        else if($scope.kind == 'donut'){
            myChart = new DonutChart(this_chart);
        }
        else if($scope.kind == 'line'){
            myChart = new TimeSeriesChart(this_chart);
        }
        else{
            $scope.title = "No kind of Chart ?? Err Err";
        }
        console.log('Make me a chart');
        $scope.legend = myChart.legend;
        console.log(JSON.stringify($scope.legend, null, 4));
        $scope.title = this_chart.title;
        console.log($scope.title);
        $scope.data = myChart.data;
        console.log(JSON.stringify($scope.data, null, 4));
        $scope.options = myChart.options;
        console.log(JSON.stringify($scope.options, null, 4));
        $scope.chartLabel = this_chart.seriesTitle;



    }]);

angular.module('app.services')


.factory('CircleGraphParent', function(){

        return this;
    })
.factory('PieChart', ['CircleGraphParent' , function(CircleGraphParent){
        var myService = Object.create(CircleGraphParent);

        function PieChart( ChartData ){
            this.options = {thickness: 200 };
            this.data = ChartData.data;
        }


        return PieChart;
    }])
    .factory('DonutChart', function(){
        function DonutChart( ChartData ){
            this.options = {thickness: 10};
            this.data = ChartData.data;
        }
        return DonutChart;
    })
.factory('BarChartParent', function(){
        var chartLabels;
        this.createLegend = function( labels ){
            console.log('labels = ' + labels);
            chartLabels = labels;
            var legend = [];

            var len = labels.length;
            for (var i = 0; i < len; i++) {
                if (labels[i].length > 4) {
                    var legendItem;
                    if (labels[i].indexOf(' ') > 0) {
                        var words = labels[i].split(' ');
                        console.log('lbl' + labels[i]);
                        var lbl = "";
                        for (var j = 0; j < words.length; j++) {
                            lbl += words[j].charAt(0);
                        }
                        legendItem = {
                            full: labels[i],
                            short: lbl
                        }
                    }
                    else {
                        legendItem = {
                            full: labels[i],
                            short: labels[i].substring(0, 4)
                        }
                    }
                    chartLabels[i] = legendItem.short;
                    legend.push(legendItem);
                }
            }
            console.log(JSON.stringify(chartLabels));
            return legend;
        }
        this.getChartLabels = function(){
            console.log('in getchartlabel' + chartLabels);
            return chartLabels;
        };
        this.barOptions = function( col, title){
            console.log('charlabels');
            console.log('chartColor' + col);
            return {
                tooltip: {
                    formatter: function(x, y, series) {
                        return chartLabels[x] + ' : ' + y ;
                    }
                },
                axes: {
                    x: {
                        key: "x",
                        type: 'linear',
                        labelFunction: function(v) {
                            return chartLabels[v];
                        }
                    },
                    y: {
                        min: 0,
                        labelFunction: function(value){
                            if(parseInt(value,10) === value){
                                return value;
                            }
                            return "";
                        }
                    }
                },
                series: [{
                    y: "val_0",
                    label: title,
                    color: col,
                    type: 'column'
                }]
            };
        }
        return this;
    })
.factory('BarChart' , ['BarChartParent', function(BarChartParent){

        var service = Object.create(BarChartParent);

        var chartLabels;
        function BarChart( ChartData ){

            service.legend = service.createLegend( ChartData.labels  );
            chartLabels = service.getChartLabels();
            service.options = service.barOptions( ChartData.color , ChartData.seriesTitle );
            service.data = ChartData.data;
            return service;
        }
        return BarChart;

    }])
    .factory('StackedChart', ['BarChartParent', function(BarChartParent){
        var myChart = Object.create(BarChartParent);
        var colors = ['blue','red','green','purple','orange','grey','yellow'];

        function StackChart( ChartData ){
            myChart.legend = myChart.createLegend( ChartData.labels  );
            var chartLabels = myChart.getChartLabels();
            console.log('no charts' + chartLabels);
            myChart.options = myChart.barOptions( ChartData.color , ChartData.seriesTitle );
            var seriesY = createSeriesY( ChartData.labels );
            myChart.options.stacks = [
                {
                    axis: 'y',
                    series : seriesY
                }
            ];

            myChart.options.lineMode = 'cardinal';
            myChart.options.series = createSeriesX( ChartData.stack_groups , chartLabels);
            myChart.data = ChartData.data;
            return myChart;
        }

        function createSeriesX( groups , chartLabels){
            var arr = [];
            for(var i = 0; i < groups.length; i++ ){
                var item = {
                    id : 'id_' + i,
                    y : groups[i],
                    label : groups[i],
                    type : 'column',
                    color: colors[i]
                }
                arr.push(item);
            }
            return arr;
        }

        function createSeriesY( array ){
            var arr = [];
            for(var i = 0 ; i < array.length ; i++ ){
                arr.push('id_' + i);
            }
            return arr;
        }

        return StackChart;

    }])
    .factory('TimeSeriesChart',function(){
        function TimeSeriesChart( Chart ){
            var data = Chart.data;
            data.forEach(function(row){
                row.x = new Date(row.x);
            })
            this.options = timeOptions( Chart.color, Chart.seriesTitle );
            this.data = data;
        }
        return TimeSeriesChart;

        function timeOptions( col, title){
            return {
                axes: {
                    x: {
                        type: "date"
                    },
                    y: {
                        min: 0,
                        labelFunction: function(value){
                            if(parseInt(value,10) === value){
                                return value;
                            }
                            return "";
                        }
                    }},
                series: [{
                    y: "val_0",
                    label: title,
                    color: col
                }],
                tooltip: {
                    mode: "scrubber",
                    formatter: function (x, y, series) {
                        return moment(x).fromNow() + ' : ' + y;
                    }
                }
            };
        }
    });