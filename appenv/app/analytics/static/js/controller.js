angular.module('analytics.controllers', []).
controller('reportsController', function($scope, reportService) {
    reportService.getAllReports()
	.then(function (response) {
    	$scope.reports = response.data;
	},function (response){
    	console.log(response);
	});

	$scope.fetchData = function(reportName){
		reportService.getReportData(reportName)
		.then(function(response){
			console.log(response.data)
			$scope.reportData = response.data;
		}, function(response){
			console.log(response);
		})
	}
});
