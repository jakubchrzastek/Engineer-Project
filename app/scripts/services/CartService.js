(function() {
    myapp.service('CartService', CartService);
    CartService.$inject = ['$http', '$timeout', 'API'];

    function CartService($http, $timeout, API) {

        var local = this;
        local.data = {};

        local.getProducts = function(id) {
            return $http.get(API + '/api/products/all', id)
                .then(function(response) {
                    return response.data;
                });
        };

        local.orderProducts = function(obj) {
            return $http.post(API + '/api/products/order', obj)
            .then(function(response) {
                return response;
            });
        };

        local.getFromStorage = function() {
            const cart = sessionStorage.getItem("shoppingCart");
            return JSON.parse(cart);
        };

        local.getName = function() {
            return sessionStorage.getItem("username");
        };
    };


}());