angular.module('starter.services', [ 'ngResource', 'base64' ]);
angular.module('starter.controllers', []);

angular.module('d3',[]);
angular.module('app.controllers',[]);
angular.module('app.services',['ngResource', 'base64'])
    //Local Storage Service taken directly from learn.ionicframework.com
    .factory('$localstorage', ['$window', '$q' , function($window, $q) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            remove: function(key){
                $window.localStorage.removeItem(key);
            }
        }
    }]);


