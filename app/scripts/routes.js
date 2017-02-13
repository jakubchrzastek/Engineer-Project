'use strict';
(function() {
    myapp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/html/functional/login.html',
        controller: 'loginController',
    })
    .state('logout', {
        url: '/logout',
        controller: 'logoutController'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'templates/html/functional/register.html',
        controller: 'registerController'
    })
    .state('admin', {
        url: '/admin',
        templateUrl: 'templates/html/admin/admin.html',
        controller: 'adminController'
    })
    .state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/html/admin/dashboard.html',
        controller: 'dashboardController'
    })
            .state('admin.customers', {
                url: '/customers',
                templateUrl: 'templates/html/admin/customers.html',
                controller: 'customersController'
            })
            .state('admin.products', {
                url: '/products',
                templateUrl: 'templates/html/admin/products.html',
                controller: 'productsController',
                resolve: {
                    Products: function(ProductService) {
                        return ProductService.getProducts()
                            .then(function(products) {
                                return ProductService.data.products = products;
                            })
                    }
                }
            })
            .state('admin.products.add', {
                url: '/add',
                templateUrl: 'templates/html/admin/productsAdd.html',
                controller: 'productsAddController',
                resolve: {
                    prepareProduct: function(ProductService, $timeout, $http, API) {
                        return $timeout(function() {
                            $http.get(API + '/api/products/add', function(response) {
                                return response;
                            })
                        });
                    }
                }
            })
            .state('admin.products.edit', {
                url: '/:id',
                templateUrl: 'templates/html/admin/productsEdit.html',
                controller: 'productsEditController',
                resolve: {
                    editProduct: function(ProductService, $stateParams, $timeout) {
                        return $timeout(function() {
                            var routeId = parseInt($stateParams.id);
                            return ProductService.getProducts(routeId).then(function(products) {
                                var productId = products.map(function(product) {
                                    return product.id;
                                }).indexOf(routeId);

                                return products[productId];
                            });
                        })
                    }
                }
            })
            .state('admin.orders', {
                url: '/orders',
                templateUrl: 'templates/html/admin/orders.html',
                controller: 'ordersController'
            })
            .state('admin.orders.detail', {
                url: '/:id',
                templateUrl: 'templates/html/admin/orderView.html',
                controller: 'orderViewController'
            })
            .state('user', {
                url: '/user',
                templateUrl: 'templates/html/user/user.html',
                controller: 'userController'
            })
            .state('user.products', {
                url: '/products',
                templateUrl: 'templates/html/user/products.html',
                controller: 'CartController'
            })
            .state('user.cart', {
                url: '/mycart',
                templateUrl: 'templates/html/user/cart.html',
                controller: 'myCartController'
            })
            .state('user.order', {
                url: '/order',
                templateUrl: 'templates/html/user/order.html',
                controller: 'orderController'
            })
            .state('user.order.detail', {
                url: '/:id',
                templateUrl: 'templates/html/user/orderView.html',
                controller: 'orderViewController'
            });

        $urlRouterProvider.otherwise('/login');

    });
})();