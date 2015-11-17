/**
 * Created by areynolds on 11/2/2015.
 */


//This service creates, fetches, stores the data for a chart
//From this data a chart can be displayed by passing the
//data into a ng-linechart directive
angular.module('app.services')

.factory('ChartingDataService', [ '$localstorage', 'ChartStore' , function($localstorage,ChartStore){

        return{
            create : createNewChart
        };


        function createNewChart(options){
            console.log('creating new chart');
            var report_data = $localstorage.getObject('current-report-data');
            console.log('data?' + report_data);

            var typeOfChart = options.type;
            var configVars = configChartAxises(typeOfChart);

            var myChart;
            if(typeOfChart == 'peoplePerDepartment' || typeOfChart == 'peoplePerLocation') {
                myChart = configChart(configVars, report_data.data, options.color, options.kind);
            }
            else if( typeOfChart == 'peopleOverTime'){
                myChart = configTimeChart(configVars, report_data.data, options.color);
            }
            else if ( typeOfChart == 'peopleByDepartmentPerLocation'){
                myChart = configStackedChart(configVars, report_data.data);
            }


            myChart.seriesTitle = configVars.title;
            myChart.color = options.color;
            myChart.title = options.title;
            myChart.type = options.type;
            myChart.dateCreated = new Date();
            myChart.kind = options.kind;
            ChartStore.save(myChart);
            return myChart;
        }
        function configStackedChart(vars,data){
            var chart = {
                data : [] ,
                labels : [] ,
                stack_groups : []
            }

            for( var i = 0; i < data.length; i++ ) {
                if( chart.stack_groups.indexOf( data[i][vars.keyDep] ) == -1 ){
                    if(data[i][vars.keyDep] != ''){
                        chart.stack_groups.push(data[i][vars.keyDep]);
                    }
                }
            }
            console.log(JSON.stringify(chart.stack_groups));
            //create data item in order to copy
            var dataItem = {};
            for(var i = 0; i < chart.stack_groups.length; i++){
                dataItem[ chart.stack_groups[i] ] = 0;
            }


            for( var i = 0 ; i < data.length; i++){
                if( chart.labels.indexOf( data[i][vars.keyLoc] ) == -1 ) {
                    if( data[i][vars.keyLoc] &&
                        data[i][vars.keyLoc] != ''){
                        chart.labels.push( data[i][vars.keyLoc] );
                    }
                }
            }

            //Create data array from labels / stack_groups
            for(var i = 0 ; i < chart.labels.length; i++ ){
                var stack = angular.copy(dataItem);
                stack.x = i;
                var location = chart.labels[i];
                for(var k = 0; k < data.length; k++){
                    if( data[k][vars.keyLoc] == location ){
                        stack[ data[k][vars.keyDep]] ++ ;
                    }
                }
                chart.data.push(stack);
            }

            return chart;
        }

        function configTimeChart(vars,data,color){
            var chart = {
                data : [],
                options: {}
            };

            data = data.sort(function(a,b){
                return new Date(a["Hire Date"]).getTime() - new Date(b["Hire Date"]).getTime()
            });

            var len = data.length;
            for(var i = 0 ; i < len ; i++ ){
                if( data[i]['Hire Date'] &&
                    data[i]['Hire Date'] != ''){
                    var point = {
                        x : data[i]['Hire Date'],//new Date(data[i]['Hire Date']) ,
                        val_0 : i + 1
                    };
                    chart.data.push(point);
                }
            }
            return chart;
        }

        /*
        Get data for chart from Report data
         */
        function configChart(vars, data, color, kind){
            var chart = {
                data : [],
                options: {}
            };
            var colors = ['blue','red','green','purple','orange','grey','yellow'];

            var groups = [];
            var counter = [];
            console.log(JSON.stringify(data.data,null,4));
            var len = data && data.length;
            console.log('incoming data ' + data.data + ' len ' + len);
            for( var i = 0; i < len ; i++ ){
                var needToAddLabel = true;
                var this_obj_value = data[i][vars.key];
                for(var j = 0; j < groups.length; j++){
                    if( groups[j] == this_obj_value){
                        counter[j]++;
                        needToAddLabel = false;
                        break;
                    }
                }
                if(needToAddLabel && this_obj_value &&
                    this_obj_value != ''){
                    groups.push( this_obj_value );
                    counter.push(1);
                }
            }

            //BAR CHART
            if(kind == 'bar' || kind == 'line'){
                var numLabels = groups.length;
                for(var i = 0; i < numLabels; i++){
                    var bar = {
                        x : i ,
                        val_0 : counter[i]
                    }
                    chart.data.push(bar);
                }
            }
            else if( kind == 'pie' || kind == 'donut') {
                len = groups.length;
                for(var i = 0; i < len; i++){
                    var rgb = 255/(i+2);
                    var portion = {
                        label : groups[i] ,
                        value : counter[i],
                        color: colors[i]
                    }
                    chart.data.push(portion);
                }
            }


            console.log(JSON.stringify(chart.data,null,4));
            //Create legend for longer labels

            chart.labels = groups;
            console.log('chart data len ' + chart.data.length);


            return chart;

        }



        function configChartAxises(chartType){
            var axises = {
                key : null ,
                title: null
            };
            switch(chartType){
                case 'peoplePerDepartment':
                    axises.key = 'Department Name';
                    axises.title = 'People per Department';
                    break;
                case 'peopleOverTime':
                    axises.key = 'Hire Date';
                    axises.title = 'Workforce for GTNexus over Time';
                    break;
                case 'peoplePerLocation':
                    axises.key = 'Name';
                    axises.title = "People per Location";
                    break;
                case 'peopleByDepartmentPerLocation':
                    axises.keyLoc = 'Name';
                    axises.keyDep = 'Department Name';
                    break;
            }
            //console.log(JSON.stringify(axises));
            return axises;
        }

    }

    ])

.factory('ChartStore', [ '$localstorage' , function($localstorage){

    //PUBLIC FACING METHODS
    return{
        save : function(chart){
            this.dirty = true;
            chart.id = getChartIndx();
            console.log('saving chart ' + chart.id);
            $localstorage.setObject('chart' + chart.id , chart );
        },
        getChart: function(idx){
            return $localstorage.getObject('chart' + idx);
        },
        setChart: function(idx,chart){
            if($localstorage.getObject('chart'+ idx )){
                $localstorage.setObject('chart' + idx , chart)
                return true;
            }
            else{
                return false;
            }
        },
        getAllCharts: function(){
            var charts = [];
            for(var i = 0; i < 50; i ++){
                var chart = $localstorage.getObject('chart' + i);
                if(chart != null && chart.id != undefined){
                    charts.push( chart )
                }
            }
            return charts;
        },
        clearCharts: function(){
            var iter = 0;
            while( iter < 100 ){
                if( $localstorage.get('chart' + iter)){
                    $localstorage.remove('chart' + iter);
                }
                else{
                    break;
                }
                iter++;
            }
        },
        delete : function(idx){
            $localstorage.remove('chart' + idx);
        }
    };


    //PRIVATE METHODS

    function getChartIndx(){
        var iter = 0;
        while(iter < 100 ){
            var validChart = $localstorage.getObject('chart' + iter);
            if( validChart != null && validChart.id === undefined ){
                return iter;
            }
            iter++;
        }
        return null;
    }
    }]);