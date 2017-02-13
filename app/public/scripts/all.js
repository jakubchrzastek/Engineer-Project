'use strict';
var myapp = angular.module('myApp', ['ui.router', 'ngMessages'])

myapp.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.previousState = function() {

            if (from.name || fromParams) {
                $state.transitionTo(from.name, fromParams);
            } else {
                $state.transitionTo($state.$current.parent);
            }

        }
    });
}]);
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
'use strict';
(function() {
angular.module('myApp')
	.directive('menu', [function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'templates/html/functional/_menu.html',
			scope: {
				content: '='
			},
			link: function($scope, $element, $attrs) {
				$scope.element = $element;
			},
			controller: function($scope) {
				//console.log($scope.element); // wyswietli html elementu na ktory jest nalozona dyrektywa
			}
		}
	}]);
})();
'use strict';
(function() {
angular.module('myApp')
    .directive('orderView', [function() {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'templates/html/functional/_orderview.html',
            link: function($scope, $element, $attrs) {
                $scope.element = $element;
            }
        }
    }]);
})();
'use strict';
(function() {
    angular.module('myApp')
        .directive('pwCheck', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    var password = "#" + attrs.pwCheck;
                    $(elem).add(password).on('keyup', function() {
                        scope.$apply(function() {
                            ctrl.$setValidity('pwmatch', elem.val() === $(password).val());
                        });
                    });
                }
            };
        }]);
})();
(function() {
    myapp.service('CartService', CartService);
    CartService.$inject = ['$http', '$timeout', 'API'];

    function CartService($http, $timeout, API) {

        //set variables for this service to access them globally
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
(function() {
    myapp.service('CustomerService', CustomerService);
    CustomerService.$inject = ['$http', '$timeout', 'API'];

    function CustomerService($http, $timeout, API) {

        //set variables for this service to access them globally
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
        /// dont touch nothing below
        return local;
    };


}());
'use strict';

angular.module('myApp')
    .factory('httpRequestInterceptor', ['$rootScope', function($rootScope) {
        return {
            request: function($config) {
                if (sessionStorage.getItem('token')) {
                    $config.headers['Authorization'] = sessionStorage.getItem('token');
                }
                return $config;
            }
        };
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    }])
    .constant('API', 'http://localhost:9090');
(function() {
    myapp.service('orderService', orderService);
    orderService.$inject = ['$http', '$timeout', 'API'];

    function orderService($http, $timeout, API) {

        //set variables for this service to access them globally
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
(function() {
    myapp.service('ProductService', ProductService);
    ProductService.$inject = ['$http', '$timeout', 'API'];

    function ProductService($http, $timeout, API) {
        //set variables for this service to access them globally
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
(function() {
    myapp.service('dashboardService', dashboardService);
    dashboardService.$inject = ['$http', '$timeout', 'API'];

    function dashboardService($http, $timeout, API) {

        //set variables for this service to access them globally
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
'use strict';

(function() {
    angular.module('myApp')
        .controller('adminController', adminController);

    adminController.$inject = ['$scope', 'ValidationService', '$state'];

    function adminController($scope, ValidationService, $state) {

        if (ValidationService.userData.rola !== 'admin') {
            $state.go('login');
        }

        $scope.adminMenu = [{
            icon: 'fa fa-tachometer',
            state: 'admin.dashboard',
            text: 'Dashboard'
        }, {
            icon: 'fa fa-users',
            state: 'admin.customers',
            text: 'Customers'
        }, {
            icon: 'fa fa-gift',
            state: 'admin.products',
            text: 'Products'
        }, {
            icon: 'fa fa-truck',
            state: 'admin.orders',
            text: 'Orders'
        }, {
            icon: 'fa fa-sign-out',
            state: 'logout',
            text: 'Log out'
        }];

    }
})();
'use strict';

(function() {
    angular.module('myApp')
        .controller('customersController', customersController);

    customersController.$inject = ['$scope', '$http', 'CustomerService', 'API'];

    function customersController($scope, $http, CustomerService, API) {
        $scope.sortType = 'id';
        $scope.sortReverse = false;
        CustomerService.getCustomers().then(function(response) {
            $scope.category = response.data;
        });
        $scope.resetPassword = function(login) {
            swal({
                    title: "Are you sure reset password?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "Yes, reset password!",
                    closeOnConfirm: false
                },
                function() {
                    $http.post(API + '/api/customers/resetpassword', {
                            login: login
                        })
                        .then(function(response) {
                            if (response.status == 200) {
                                swal(
                                    'Changed!',
                                    'Passwrod has been reset!',
                                    'success'
                                );
                            }
                        });
                });
        };
        $scope.deleteCustomers = function(item) {
            swal({
                    title: "Are you sure?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function() {
                    CustomerService.deleteCustomers(item.id).then(function(response) {
                        var index = $scope.category.indexOf(item);
                        if (response === 200) {
                            $scope.category.splice(index, 1);
                            swal("Deleted!", "Customer has been removed", "success");
                        }
                    })
                });
        }
    }
})();
'use strict';

(function() {
    angular.module('myApp')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$scope', 'dashboardService', 'API'];

    function dashboardController($scope, dashboardService, API) {

        dashboardService.getCategory()
            .then(function(response) {
                $scope.category = response;
                $scope.data = [];
                $scope.nazwa_kategoria = [];
                for (var i = 0; i < response.length; i++) {
                    $scope.data.push($scope.category[i].ilosc);
                }
                for (var i = 0; i < response.length; i++) {
                    $scope.nazwa_kategoria.push($scope.category[i].nazwa_kategoria);
                }
                var width = 500,
                    height = 300,
                    radius = Math.min(width, height) / 2 - 20;

                var color = d3.scale.ordinal()
                    .range(["#3366cc", "#dc3912", "#ff9900", "#109618"]);
                var pie = d3.layout.pie()
                    .padAngle(.05)
                    .value(function(d) {
                        return d;
                    });

                var arc = d3.svg.arc()
                    .innerRadius(60)
                    .outerRadius(radius);

                var svg = d3.selectAll("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var category = svg.selectAll(".category")
                    .data(pie($scope.data))
                    .enter().append("g")
                    .attr('class', 'category');

                var path = category.append("path")
                    .attr("fill", function(d, i) {
                        return color(i);
                    })
                    .attr("d", arc)

                var text = category.append("text")
                    .attr("transform", function(d) {
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .attr("text-anchor", "middle")
                    .text(function(d, i) {
                        return $scope.nazwa_kategoria[i] + ": " + $scope.data[i];
                    });

            });


        dashboardService.getCustomers()
            .then(function(response) {
                $scope.customers = response;
            });

        dashboardService.getProducts()
            .then(function(response) {
                $scope.products = response;
            });

        dashboardService.getOrders()
            .then(function(response) {
                $scope.orders = response;
            });

        dashboardService.getGain()
            .then(function(response) {
                $scope.gain = response;
            });

    }
})();
'use strict';

(function() {

    angular.module('myApp')
        .controller('ordersController', ordersController);

    ordersController.$inject = ['$scope', 'orderService', 'CartService'];

    function ordersController($scope, orderService, CartService) {
        $scope.sortType = 'id';
        $scope.sortReverse = false;

        var userId = CartService.getName();

        orderService.getAllOrder().then(function(response) {
            return $scope.orders = response;
        });

        $scope.deleteOrder = function(item) {
            swal({
                    title: "Are you sure?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function() {
                    orderService.deleteOrder(item.id).then(function(response) {
                        var index = $scope.orders.indexOf(item);
                        if (response === 200) {
                            $scope.orders.splice(index, 1);
                            swal("Deleted!", "Product has been removed", "success");
                        }
                    })
                });
        };
    }
})();
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
'use strict';

(function() {
    angular.module('myApp')
        .controller('CartController', CartController);

    CartController.$inject = ['$scope', 'CartService'];

    function CartController($scope, CartService) {
        CartService.getProducts()
            .then(function(response) {
                return $scope.products = response;
            });

        $scope.cartData = [];

        $scope.removeFromCard = function(id) {
            $scope.cartData.splice(id, 1);
        }

        $scope.addToCard = function(id, nazwa, cena, kategoria) {
            var obj = {
                'id': id,
                'nazwa': nazwa,
                'ilosc': 1,
                'Kategorie': kategoria,
                'cena': cena
            };

            if ($scope.cartData.find(el => el.id === id)) {
                const index = $scope.cartData.findIndex(el => el.id === id)
                if (index !== -1) {
                    $scope.cartData[index].ilosc++;
                }
            } else {
                $scope.cartData.push(obj);
            }
        }

        $scope.moreItem = function(id) {
            if ($scope.cartData.find(el => el.id === id)) {
                const index = $scope.cartData.findIndex(el => el.id === id)
                if (index !== -1) {
                    $scope.cartData[index].ilosc++;
                } else {

                }
            }
        }

        $scope.lessItem = function(id) {
            if ($scope.cartData.find(el => el.id === id)) {
                const index = $scope.cartData.findIndex(el => el.id === id)
                if (index !== -1) {
                    $scope.cartData[index].ilosc--;
                } else {

                }
            }
        }
        var totals = [];

        $scope.totalPrice = function() {

            var buy = $scope.cartData;
            buy.filter(function(item) {
                var itemPrice = item.cena * item.ilosc;
                totals.push(itemPrice);
            });


            var sumTotals = 0;
            totals = totals.filter(function(item) {
                sumTotals += item;
            });
            return sumTotals;
        }

        $scope.setCart = function() {
                sessionStorage.setItem('shoppingCart', JSON.stringify($scope.cartData));
                swal("Cart Saved!", "Go to Shopping Cart", "success");
            }
            //end
    }
})();
'use strict';

(function() {
    angular.module('myApp')
        .controller('myCartController', myCartController);

    myCartController.$inject = ['$scope', 'CartService', '$http', 'API', '$state'];

    function myCartController($scope, CartService, $http, API, $state) {

        var init = (function() {
            var totalPrice = function(cartData) {
                return cartData.map((item) => {
                    return item.cena * item.ilosc;
                }).reduce((a, b) => {
                    return a + b;
                });
            };
            const cart = CartService.getFromStorage();
            if (!cart) return;
            $scope.cart = cart;
            $scope.sum = totalPrice(cart);
        })();

        var totalPrice = function(cartData) {
            return cartData.map((item) => {
                return item.cena * item.ilosc;
            }).reduce((a, b) => {
                return a + b;
            });
        };

        var save = function(data) {
            $http.post(API + '/api/order/new', {
                    data
                })
                .success(() => {
                    sessionStorage.removeItem('shoppingCart');
                    swal(
                        'Great!',
                        'You have ordered products!',
                        'success'
                    );
                    //$state.go('order')
                })
                .error(() => {
                    swal(
                        'Error!',
                        'Problem with connect to database!',
                        'error'
                    );
                });
        };

        var onSave = function() {
            if (!$scope.cart) return;
            const cart = [];
            $scope.cart.map(function(data) {
                cart.push({
                    productId: data.id,
                    count: data.ilosc
                });
            });
            const username = CartService.getName();
            const order = {
                cart: cart,
                userId: username
            };
            save(JSON.stringify(order));
        };

        Object.assign($scope, {
            onSave
        });

    }
})();
'use strict';

(function() {
    angular.module('myApp')
        .controller('orderController', orderController);

    orderController.$inject = ['$scope', 'CartService', 'orderService'];

    function orderController($scope, CartService, orderService) {
        $scope.sortType = 'id';
        $scope.sortReverse = false;

        var userId = CartService.getName();

        orderService.getOrder(userId).then(function(response) {
            return $scope.order = response;
        });

    }
})();
'use strict';

(function() {
    angular.module('myApp')
        .controller('orderViewController', orderViewController);

    orderViewController.$inject = ['$scope', 'CartService', 'orderService', '$stateParams'];

    function orderViewController($scope, CartService, orderService, $stateParams) {

            orderService.getOrderDetail($stateParams.id).then(function(response) {
                var data = response.detail;
                var totalPrice = function(data) {
                    return data.map((item) => {
                        return item.cena * item.ilosc;
                    }).reduce((a, b) => {
                        return a + b;
                    });
                };
                $scope.sum = totalPrice(data);
                return $scope.orderDetail = response;
            });
            //end
        }
})();
'use strict';

(function() {
    angular.module('myApp')
        .controller('userController', userController);

    userController.$inject = ['$scope', 'ValidationService', '$state'];

    function userController($scope, ValidationService, $state) {

            if (ValidationService.userData.rola !== 'user') {
                $state.go('login');
            }

            $scope.userMenu = [{
                icon: 'fa fa-gift',
                state: 'user.products',
                text: 'Products'
            }, {
                icon: 'fa fa-shopping-cart',
                state: 'user.cart',
                text: 'Shopping Cart'
            }, {
                icon: 'fa fa-truck',
                state: 'user.order',
                text: 'My Order'
            }, {
                icon: 'fa fa-sign-out',
                state: 'logout',
                text: 'Log out'
            }];

        }
})();
'use strict';

(function() {

    angular.module('myApp')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', 'ValidationService', '$state'];

    function loginController($scope, ValidationService, $state) {

        $scope.signIn = function(login, password) {
            ValidationService.signIn(login, password)
                .then(function(response) {
                    //poprawna odpowiedz serwera
                    if (ValidationService.userData.rola === 'admin')
                        $state.go('admin.dashboard');
                    else if (ValidationService.userData.rola === 'user') {
                        $state.go('user.products');
                    }
                }, function(response) {
                    //niepoprawna odpowiedz serwera
                    swal("Some Error!", "You need fix your mistake", "error");
                });
        };
    }
})();
'use strict';

(function() {
    angular.module('myApp')
        .controller('logoutController', logoutController);

    logoutController.$inject = ['$scope', 'ValidationService', '$state'];

    function logoutController($scope, ValidationService, $state) {
        $state.go('login');
        sessionStorage.clear();
    }
})();
'use strict';

(function() {
    angular.module('myApp')
        .controller('registerController', registerController);

    registerController.$inject = ['$scope', 'ValidationService', '$state'];

    function registerController($scope, ValidationService, $state) {
        $scope.signUp = function(login, password, passwordRepeat) {
            ValidationService.signUp(login, password, passwordRepeat)
                .then(function(response) {
                    //poprawna odpowiedz serwera
                    $state.go('login');
                }, function(response) {
                    //niepoprawna odpowiedz serwera
                    $state.go('register');
                });
        };
    }
})();
//# sourceMappingURL=../maps/all.js.map
