(function() {
    myapp.service('orderService', orderService);
    orderService.$inject = ['$http', '$timeout', 'API'];

    function orderService($http, $timeout, API) {

        var local = this;
        local.data = {};

        local.getOrder = function(obj) {
            return $http.post(API + '/api/order/me', {
                userId: obj
            }).then(function(response) {
                return JSON.parse(response.data);
            });
        };

        local.getAllOrder = function() {
            return $http.get(API + '/api/order/all').then(function(response) {
                return JSON.parse(response.data);
            });
        };

        local.getOrderDetail = function(id){
            return $http.get(API + '/api/order/' + id).then(function(response){
                return response.data;
            })
        };

        local.deleteOrder = function(id) {
            return $http.delete(API + '/api/order/' + id).then(function(response) {
                return response.status;
            });
        };
    };


}());