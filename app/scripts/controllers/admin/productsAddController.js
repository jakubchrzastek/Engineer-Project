'use strict';

(function() {

    angular.module('myApp')
        .controller('productsAddController', productsAddController);

    productsAddController.$inject = ['$http', '$scope', 'ProductService', '$state'];

    function productsAddController($http, $scope, ProductService, $state) {
        $scope.newProduct = {};

        $scope.addNewProduct = function() {
            ProductService.addProduct($scope.newProduct).then(function(response) {

                swal(
                    'Added!',
                    'Product has been added!',
                    'success'
                );

                $state.go('admin.products');
            });
        };

        ProductService.getCategory()
            .then(function(response) {
                $scope.category = response.data;
            });
    }
})();