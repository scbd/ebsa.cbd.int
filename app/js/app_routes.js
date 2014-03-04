'use strict';

define(['app'], function (app) {

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    
        $routeProvider.
            when('/',                    { templateUrl: '/app/views/index.html',                   resolve: { }}).
            when('/countries',           { templateUrl: '/app/views/countries/index.html',         resolve: { dependencies : resolveJS() }}).
            when('/countries/:country',  { templateUrl: '/app/views/countries/index-country.html', resolve: { dependencies : resolveJS() }}).
            when('/help/404',            { templateUrl: '/app/views/help/404.html',                resolve: { }}).
            otherwise({redirectTo:'/help/404'});


        //==================================================
        //
        //
        //==================================================
        function resolveJS(dependencies)
        {
            return ['$q', '$route', function($q, $route) {

                var deferred = $q.defer();
                dependencies = dependencies || ['$route'];

                for(var i=0; i<dependencies.length; ++i) {
                    if(dependencies[i]=='$route') {
                        dependencies[i] = $route.current.$$route.templateUrl+'.js';
                    }
                }

                require(dependencies || [], function onResolved() {
                    
                    var results = Array.prototype.slice.call(arguments, 1);
                    
                    deferred.resolve(results);
               
                    return results;
                });

                return deferred.promise;
            }];
        }
    }]);
});