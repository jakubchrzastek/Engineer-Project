'use strict';

angular.module('myApp')
    .factory('httpRequestInterceptor', ['$rootScope', function($rootScope) {
        return {
            request: function($config) {
                if (sessionStorage.getItem('token')) {
                    $config.headers['Authorization'] = sessionStorage.getItem('token');
                }
                return $config;
            }
        };
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    }])
    .constant('API', 'http://localhost:9090');