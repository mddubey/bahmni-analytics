var services = angular.module('analytics.services', []);

services.factory('reportService', function ($http) {
    var reportsAPI = {};
    reportsAPI.getAllReports = function () {
        return $http({
            method: 'GET',
            url: '/analytics/allReports'
        });
    };

    reportsAPI.getReportData = function (reportName) {
        return $http({
            method: 'GET',
            url: '/analytics/report',
            params: {name: reportName}
        });
    };
    return reportsAPI;
});
