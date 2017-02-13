'use strict';

(function() {

    angular.module('myApp')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', 'ValidationService', '$state'];

    function loginController($scope, ValidationService, $state) {

        $scope.signIn = function(login, password) {
            ValidationService.signIn(login, password)
                .then(function(response) {
                    //poprawna odpowiedz serwera
                    if (ValidationService.userData.rola === 'admin')
                        $state.go('admin.dashboard');
                    else if (ValidationService.userData.rola === 'user') {
                        $state.go('user.products');
                    }
                }, function(response) {
                    //niepoprawna odpowiedz serwera
                    swal("Some Error!", "You need fix your mistake", "error");
                });
        };
    }
})();