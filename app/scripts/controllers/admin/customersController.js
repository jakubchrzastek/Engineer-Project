'use strict';

(function() {
    angular.module('myApp')
        .controller('customersController', customersController);

    customersController.$inject = ['$scope', '$http', 'CustomerService', 'API'];

    function customersController($scope, $http, CustomerService, API) {
        $scope.sortType = 'id';
        $scope.sortReverse = false;
        CustomerService.getCustomers().then(function(response) {
            $scope.category = response.data;
        });
        $scope.resetPassword = function(login) {
            swal({
                    title: "Are you sure reset password?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "Yes, reset password!",
                    closeOnConfirm: false
                },
                function() {
                    $http.post(API + '/api/customers/resetpassword', {
                            login: login
                        })
                        .then(function(response) {
                            if (response.status == 200) {
                                swal(
                                    'Changed!',
                                    'Passwrod has been reset!',
                                    'success'
                                );
                            }
                        });
                });
        };
        $scope.deleteCustomers = function(item) {
            swal({
                    title: "Are you sure?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function() {
                    CustomerService.deleteCustomers(item.id).then(function(response) {
                        var index = $scope.category.indexOf(item);
                        if (response === 200) {
                            $scope.category.splice(index, 1);
                            swal("Deleted!", "Customer has been removed", "success");
                        }
                    })
                });
        }
    }
})();