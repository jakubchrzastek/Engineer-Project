describe("controller", function() {
    'use strict';

    var p, $scope, $location, $controller, ValidationService, CustomerService, CartService, $httpBackend, $q, $stateParams, $state;

    beforeEach(function() {
        module('myApp');
        inject(function($rootScope, _$location_, _$controller_, _ValidationService_, _CustomerService_, _CartService_, _$httpBackend_, _$q_, _$stateParams_, _$state_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            $controller = _$controller_;
            ValidationService = _ValidationService_;
            CustomerService = _CustomerService_;
            CartService = _CartService_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
            $stateParams = _$stateParams_;
            $state = _$state_;
        });
    });

    describe('adminController', function() {

        it('should set admin menu', function() {

            var ctrl = $controller('adminController', {
                $scope: $scope
            });

            var menu = [{
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

            expect($scope.adminMenu).toEqual(menu);
        })
    })

    describe('userController', function() {

        it('should stay on the same site if users role is user', function() {

            ValidationService.userData.rola = "user";
            var ctrl = $controller('userController', {
                $scope: $scope
            });
            expect($location.path()).toEqual('');
        })

        it('should set client menu', function() {

            var ctrl = $controller('userController', {
                $scope: $scope
            });

            var menu = [{
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

            expect($scope.userMenu).toEqual(menu);
        })
    });

    describe('CartController', function() {
        var ctrl;

        beforeEach(function() {
            ctrl = $controller('CartController', {
                $scope: $scope
            });
        })

        it('should get products from server', function() {

            var data = [{
                "id": 1,
                "nazwa": "Red T-shirt",
                "ilosc": 1,
                "cena": 12,
                "Kategorie": "T-Shirt"
            }, {
                "id": 2,
                "nazwa": "Blue T-shirt",
                "ilosc": 6,
                "cena": 15,
                "Kategorie": "T-Shirt"
            }, {
                "id": 3,
                "nazwa": "Purple T-shirt",
                "ilosc": 0,
                "cena": 14,
                "Kategorie": "T-Shirt"
            }, {
                "id": 4,
                "nazwa": "Red Trausers",
                "ilosc": 12,
                "cena": 24,
                "Kategorie": "Trausers"
            }];

            $httpBackend.expectGET('http://localhost:9090/api/products/all').respond(data);
            CartService.getProducts().then(function() {
                expect($scope.products).toEqual(data);
            });
        })
    })

    describe('customersController', function() {
        var ctrl;

        beforeEach(function() {
            ctrl = $controller('customersController', {
                $scope: $scope
            });
        })

        it('should get customers from server', function() {

            var data = {
                "id": 4,
                "login": "adminkuba",
                "imie": "Jakub",
                "nazwisko": "Chrząstek",
                "telefon": "535072224",
                "miejscowosc": "Wrocław"
            };

            $httpBackend.expectGET('http://localhost:9090/api/customers/all').respond(data);
            CustomerService.getCustomers().then(function() {
                expect($scope.category).toEqual(data);
            });
        })
    })

})