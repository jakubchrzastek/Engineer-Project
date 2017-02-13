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