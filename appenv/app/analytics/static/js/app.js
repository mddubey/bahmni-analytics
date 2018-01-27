analyticsApp = angular.module('analytics', [
  'analytics.services',
  'analytics.controllers'
]);

analyticsApp.config(['$httpProvider', function($httpProvider) {
	var auth = window.btoa("admin:test")
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
}])
