(function() {
    myapp.service('CustomerService', CustomerService);
    CustomerService.$inject = ['$http', '$timeout', 'API'];

    function CustomerService($http, $timeout, API) {

        var local = this;
        local.data = {};

        local.getCustomers = function() {
            return $http.get(API + '/api/customers/all')
                .then(function(response) {
                    return response;
                });
        };

        local.deleteCustomers = function(id) {
            return $http.delete(API + '/api/customers/' + id).then(function(response) {
                return response.status;
            });
        };

        return local;
    };


}());