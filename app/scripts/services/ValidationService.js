'use strict';

(function() {
    myapp.service('ValidationService', ValidationService);
    ValidationService.$inject = ['$q', '$http', '$timeout', 'API'];

    function ValidationService($q, $http, $timeout, API) {

        return {

            userData: {},
            createData: {},

            signIn: function(login, password) {
                var promise = $q.defer(); //nowy promise
                var self = this;

                $http.post(API + '/api/sign_in', {
                    user: {
                        login: login,
                        password: password
                    }
                }).error(function(response, status, headers) {
                    promise.reject(response); // sprawia ze promise przestaje oczekiwać
                }).success(function(response, headers) {
                    self.userData = response.user; // do userdata przypisujemy token/role
                    sessionStorage.setItem('token', response.user.token);
                    sessionStorage.setItem('username', response.user.id);
                    promise.resolve(response);
                });

                return promise.promise;
            },

            signUp: function(login, password) {
                var promise = $q.defer();
                var self = this;

                $http.post(API + '/api/sign_up/', {
                    user: {
                        login: login,
                        password: password
                    }
                }).success(function(response) {
                    if (response == "OK") {
                        swal("Great Job!", "You create Your account", "success");
                        promise.resolve(response);
                    } else {
                        swal("Some Error!", "You need fix your mistake", "error");
                        promise.reject(response);
                    }
                }).error(function(response) {
                    promise.reject(response);
                });

                return promise.promise;
            }

        }

    };


})();