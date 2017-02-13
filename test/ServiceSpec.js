describe('service', function() {
    'use strict';

    var p, $httpBackend, ValidationService, httpRequestInterceptor, $httpProvider;

    beforeEach(function() {

        module('myApp', function(_$httpProvider_) {
            $httpProvider = _$httpProvider_;
        });
        inject(function($q, _$httpBackend_, _ValidationService_, _httpRequestInterceptor_ ) {
            p = $q.defer();
            $httpBackend = _$httpBackend_;
            ValidationService = _ValidationService_;
            httpRequestInterceptor = _httpRequestInterceptor_;
        })
    })

    describe('InterceptorService', function() {

        it('httpProvider should have httpRequestInterceptor as an interceptor', function() {
            expect($httpProvider.interceptors).toContain('httpRequestInterceptor');
        })

        it('should not place a token in the http request headers if there is none in sessionStorage', function() {
            sessionStorage.setItem('token', '');
            var config = httpRequestInterceptor.request({
                headers: {}
            });
            expect(config.headers['Authorization']).toBe(undefined);
        });

        it('should place a token in the http request headers if there is one stored in sessionStorage', function() {
            sessionStorage.setItem('token', 'testToken');
            var config = httpRequestInterceptor.request({
                headers: {}
            });
            expect(config.headers['Authorization']).toEqual('testToken');
        })

    })
})