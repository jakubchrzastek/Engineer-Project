'use strict';

(function() {
    angular.module('myApp')
        .controller('logoutController', logoutController);

    logoutController.$inject = ['$scope', 'ValidationService', '$state'];

    function logoutController($scope, ValidationService, $state) {
        $state.go('login');
        sessionStorage.clear();
    }
})();