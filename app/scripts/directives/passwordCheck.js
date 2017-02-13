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