(function() {
    myapp.service('dashboardService', dashboardService);
    dashboardService.$inject = ['$http', '$timeout', 'API'];

    function dashboardService($http, $timeout, API) {

        var local = this;
        local.data = {};

        local.getCategory = function() {
            return $http.get(API + '/api/dashboard/category')
                .then(function(response) {
                    return response.data;
                });
        };

        local.getCustomers = function() {
            return $http.get(API + '/api/dashboard/customers')
                .then(function(response) {
                    return response.data;
                });
        };

        local.getProducts = function() {
            return $http.get(API + '/api/dashboard/products')
                .then(function(response) {
                    return response.data;
                });
        };

        local.getOrders = function() {
            return $http.get(API + '/api/dashboard/orders')
                .then(function(response) {
                    return response.data;
                });
        };

        local.getGain = function() {
            return $http.get(API + '/api/dashboard/gain')
                .then(function(response) {
                    return response.data;
                });
        };
    };
}());