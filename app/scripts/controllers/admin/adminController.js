'use strict';

(function() {
    angular.module('myApp')
        .controller('adminController', adminController);

    adminController.$inject = ['$scope', 'ValidationService', '$state'];

    function adminController($scope, ValidationService, $state) {

        if (ValidationService.userData.rola !== 'admin') {
            $state.go('login');
        }

        $scope.adminMenu = [{
            icon: 'fa fa-tachometer',
            state: 'admin.dashboard',
            text: 'Dashboard'
        }, {
            icon: 'fa fa-users',
            state: 'admin.customers',
            text: 'Customers'
        }, {
            icon: 'fa fa-gift',
            state: 'admin.products',
            text: 'Products'
        }, {
            icon: 'fa fa-truck',
            state: 'admin.orders',
            text: 'Orders'
        }, {
            icon: 'fa fa-sign-out',
            state: 'logout',
            text: 'Log out'
        }];

    }
})();