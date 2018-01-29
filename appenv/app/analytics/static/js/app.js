analyticsApp = angular.module('analytics', ['ngRoute',
    'analytics.services',
    'analytics.controllers'
]);

analyticsApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/static/partials/reports.html', // this location
            controller: 'reportController' // and apply instructions from this controller
        })
        .otherwise({ // Any other URL, take me back to /
            redirectTo: '/'
        });
});
