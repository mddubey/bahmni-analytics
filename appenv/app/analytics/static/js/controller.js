var controllers = angular.module('analytics.controllers', []);
controllers.controller('reportController', function ($scope, reportService) {
    reportService.getAllReports()
        .then(function (response) {
            $scope.reports = response.data;
        }, function (response) {
            console.log(response);
        });

    function showDatatable() {
        var tableSelector = "[id^='dt-']";
        angular.element(jQuery(tableSelector)).ready(function () {
            jQuery(tableSelector).each(function () {
                jQuery(this).DataTable();
            })

        })
    }

    $scope.fetchData = function (reportName) {
        reportService.getReportData(reportName)
            .then(function (response) {
                $scope.reportData = response.data;
                showDatatable();
            }, function (response) {
                console.log(response);
            })
    };
    $scope.showChart = function (reportName) {
        let currentTableData = $scope.reportData[reportName];

        let category = 'categories';
        let groupCol = ["concept_name"];
        let valueColumns = ['other', 'total', 'female', 'male'];

        let groups = _(currentTableData).groupBy(function (data) {
            return groupCol.map(function (grp) {
                return data[grp]
            }).join("#");
        });

        let chartData = _(groups).map(function (group, groupKey) {
            let totalForGroup = _(group).reduce(function (acc, x) {
               valueColumns.forEach(function (val) {
                   acc[val] = acc[val] || 0;
                   acc[val] += x[val];
               });
               return acc;
            },{});
            totalForGroup[category] = groupKey;
            return totalForGroup;
        });

        let chartType = 'bar';
        c3.generate({
            bindto: '#chart',
            data: {
                json: chartData,
                type: 'bar',
                keys: {
                    x: category,
                    value: valueColumns
                }
            },
            axis: {
                x: {
                    type: 'categorized'
                }
            }

        });
    }
});
