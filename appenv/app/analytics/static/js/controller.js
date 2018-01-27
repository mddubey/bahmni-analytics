angular.module('analytics.controllers', []).
controller('reportController', function($scope, reportService) {
    reportService.getAllReports()
	.then(function (response) {
    	$scope.reports = response.data;
	},function (response){
    	console.log(response);
	});

	$scope.fetchData = function(reportName){
		reportService.getReportData(reportName)
		.then(function(response){
			$scope.reportData = response.data;
		}, function(response){
			console.log(response);
		})
	}
});
