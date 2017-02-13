(function() {
'use strict'

    angular.module('myApp')
        .controller('productsEditController', ['$scope', '$stateParams', 'ProductService', 'editProduct', '$state',
            function($scope, $stateParams, ProductService, editProduct, $state) {
                if (editProduct) {
                    $scope.product = editProduct;
                }
                ProductService.getCategory()
                    .then(function(response) {
                        return $scope.category = response.data;
                    });
                $scope.editProduct = function() {
                    ProductService.editProduct($scope.product).then(function(response) {
                        if (response === 200) {
                            swal(
                                'Changed!',
                                'Product has been changed!',
                                'success'
                            );
                        };
                        $state.go('admin.products');
                    });
                };
            }
        ]);
})();