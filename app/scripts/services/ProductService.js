(function() {
    myapp.service('ProductService', ProductService);
    ProductService.$inject = ['$http', '$timeout', 'API'];

    function ProductService($http, $timeout, API) {

        var local = this;
        local.data = {};
        // ProductService.data ktory dziedziczy po this
        local.routerData = {};

        local.getProducts = function() {

            return $http.get(API + '/api/products/all')
                .then(function(response) {
                    return response.data;
                });
        };

        local.getCategory = function() {
            return $http.get(API + '/api/product/category')
                .then(function(response) {
                    return response;
                });
        };

        local.editProduct = function(obj) {
            return $http.put(API + '/api/products/save', {
                data: obj
            }).then(function(response) {
                return response.status;
            });
        };

        local.addProduct = function(obj) {
            return $http.post(API + '/api/products/add', {
                data: obj
            }).then(function(response) {
            return response.data.newProductId;
            })
        }


        local.deleteProduct = function(id) {
            return $http.delete(API + '/api/products/' + id).then(function(response) {
                return response.status;
            });
        };

        return local;

    }


}());