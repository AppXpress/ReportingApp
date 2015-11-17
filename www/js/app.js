// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('myApp', [ 'ionic', 'app.services', 'app.controllers', 'pascalprecht.translate', 'starter.controllers', 'n3-line-chart','ngCordova','n3-pie-chart'])

.run(function($ionicPlatform, $translate, $rootScope, $ionicLoading, $ionicSideMenuDelegate) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory
		// bar above the keyboard
		// for form inputs)
		
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(navigator){
			console.log('navigator');
			if(navigator.camera){
				console.log('navigator.camera');
			}
		}
		if(window.GTNXReport){
			console.log('gnt report nah');
		}
		
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleLightContent();
		}
		if (typeof navigator.globalization != "undefined") {

			navigator.globalization.getLocaleName(function(locale) {

				if (typeof console != "undefined") {
					console.log('locale: ' + locale.value + '\n');
				}
				// use is async with un-known language keys
				$translate.use((locale.value).split("-")[0]).then(function(data) {
					if (typeof console != "undefined") {
						console.log("SUCCESS -> " + data);
					}

				}, function(error) {
					if (typeof console != "undefined") {
						console.log("ERROR -> " + error);
					}
					alert("Failed to set locale based on the device locale");
				});
			}, function(e) {

				if (typeof console != "undefined") {
					console.log("Error code: " + e.code + " error msg: " + e.message);
				}
				alert('Error getting language\n');

			});
		} else {
			if (typeof console != "undefined") {
				console.log("Globalization plugin is not activated");
			}
		}

        $rootScope.$on('loading:show', function () {
            $ionicLoading.show({
                content: '<ion-spinner> Loading...</ion-spinner>'

            })
        })

        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide()
        })


	});
}).config(function($stateProvider, $urlRouterProvider, $translateProvider,$httpProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

    .state('login',{
        url : '/login',
        templateUrl : 'templates/login.html' ,
        controller : 'LoginController',
        cache: false
    })

	// setup an abstract state for the tabs directive
	.state('tab', {
		url : "/tab",
		abstract : true,
		templateUrl : "templates/tabs.html",
        controller : function($scope,$state){
            console.log($state.current);
            $scope.header = {} ;

            $scope.$watch(function(){
                return $state.current.data.title;
            },function(){
                $scope.header.title = $state.current.data.title;
            });
        }
	})

	// Each tab has its own nav history stack:

	.state('tab.charts', {
		url : '/charts',
        data : {
            title: 'My Charts'
        },
		views : {
			'charts-screen' : {
				templateUrl : 'templates/chart.html',
				controller : 'ChartController'
			}
		}
	})

	.state('tab.company-data', {
		url : '/companydata',
        cache : false ,
		views : {
			'company-data' : {
				templateUrl : 'templates/company-data.html',
				controller : 'CompanyDataListController'
			}
		},
        data : {
            title: 'Company Data'
        }
	})
        .state('view-chart',{
            url: '/chart/:chartId',
            templateUrl : 'templates/view-chart.html',
            controller : 'IndividualChartController',
            reload : true
        })

	.state('tab.account', {
		url : '/account',
        data : {
            title : 'My Account'
        },
		views : {
			'tab-account' : {
				templateUrl : 'templates/tab-account.html',
				controller : 'AccountController'
			}
		}
	})
	.state('tab.run-report',{
		url : '/report',
		views : {
			'run-report-screen' : {
				templateUrl : 'templates/run-report.html',
				controller : 'ReportController'
			}
		},
            data : {
                title : 'Run A Report'
            },
        resolve: {
            title : function(){
                return { value : 'Run a Report'}
            }
        }

	})
    .state('new-chart',{
        url : '/newchart',
        templateUrl : 'templates/new-chart.html',
        controller : 'NewChartController'
    })
    ;

	// if none of the above states are matched, use this as the fallback
	//$urlRouterProvider.otherwise('/tab/dash');


    $urlRouterProvider.otherwise('/tab/report');

    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            request: function (config) {
                $rootScope.$broadcast('loading:show')
                return config
            },
            response: function (response) {
                $rootScope.$broadcast('loading:hide')
                return response
            }      ,
            responseError: function(response){
                $rootScope.$broadcast('loading:hide')
                return $q.reject( response ) ;
            }
        }
    });

	// Angular Translate
	$translateProvider.useStaticFilesLoader({
		prefix : 'js/locales/locale-',
		suffix : '.json'
	}).registerAvailableLanguageKeys([ 'en', 'de', 'fr', 'es', 'it' ], {
		'en-*' : 'en',
		'de-*' : 'de',
		'fr-*' : 'fr',
		'es-*' : 'es',
		'it-*' : 'it'
	}).preferredLanguage('en').fallbackLanguage("en").useSanitizeValueStrategy('sanitize');

}).constant('globals', {
        dataKey : 'e46e681e5f9122329d73ce7dfcacc19082111ca3',
        applicationHostName : 'https://commerce-rctq.qa.gtnexus.com/rest/310'
    }

);
