'use strict';

(function() {
    angular.module('myApp')
        .controller('registerController', registerController);

    registerController.$inject = ['$scope', 'ValidationService', '$state'];

    function registerController($scope, ValidationService, $state) {
        $scope.signUp = function(login, password, passwordRepeat) {
            ValidationService.signUp(login, password, passwordRepeat)
                .then(function(response) {
                    //poprawna odpowiedz serwera
                    $state.go('login');
                }, function(response) {
                    //niepoprawna odpowiedz serwera
                    $state.go('register');
                });
        };
    }
})();