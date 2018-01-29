angular.module('analytics.controllers', []).
controller('reportController', function($scope, reportService) {
    reportService.getAllReports()
	.then(function (response) {
    	$scope.reports = response.data;
	},function (response){
    	console.log(response);
	});

    function showDatatable() {
        var tableSelector = "[id^='dt-']";
        angular.element(jQuery(tableSelector)).ready(function () {
            jQuery(tableSelector).each(function (e) {
                jQuery(this).dataTable();
            })

        })
    }

    $scope.fetchData = function(reportName){
		reportService.getReportData(reportName)
		.then(function(response){
			$scope.reportData = response.data;
			showDatatable()
		}, function(response){
			console.log(response);
		})
	}


});
