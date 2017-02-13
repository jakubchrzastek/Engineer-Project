'use strict';

(function() {

    angular.module('myApp')
        .controller('productsController', productsController);

    productsController.$inject = ['$scope', 'ProductService', '$filter'];

    function productsController($scope, ProductService, $filter) {

        $scope.sortType = 'id';
        $scope.sortReverse = false;

        $scope.products = ProductService.data.products;

        $scope.deleteProduct = function(item) {
            swal({
                    title: "Are you sure?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function() {
                    ProductService.deleteProduct(item.id).then(function(response) {
                        var index = $scope.products.indexOf(item);
                        if (response === 200) {
                            $scope.products.splice(index, 1);
                            swal("Deleted!", "Product has been removed", "success");
                        }
                    })
                });
        };
    }
})();