
(function () {
    'use strict';
    angular.module('app')
        .config([     '$httpProvider','$locationProvider','ConfigsProvider',
            function ($httpProvider  , $locationProvider , ConfigsProvider) {
                $locationProvider.html5Mode(true);
                $httpProvider.defaults.headers.get = { 'X-Auth-Token' : ConfigsProvider.getApiKey() };
            }
        ]);
})();
