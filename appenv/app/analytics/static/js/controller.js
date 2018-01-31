function showDatatable() {
    const tableSelector = "[id^='dt-']";
    angular.element(jQuery(tableSelector)).ready(function () {
        jQuery(tableSelector).each(function () {
            jQuery(this).DataTable();
        })

    })
}

function showChart(currentTableData, chartOptions) {
    let groupColumns = chartOptions.groups;
    let valueColumns = chartOptions.values;
    let chartType = chartOptions.type;
    let category = 'categories';

    let groups = _(currentTableData).groupBy(function (data) {
        return groupColumns.map(function (grp) {
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
        }, {});
        totalForGroup[category] = groupKey;
        return totalForGroup;
    });

    c3.generate({
        bindto: '#chart',
        data: {
            json: chartData,
            type: chartType,
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

const controllers = angular.module('analytics.controllers', []);
controllers.controller('reportController', function ($scope, $modal, reportService) {
    reportService.getAllReports()
        .then(function (response) {
            $scope.reports = response.data;
        }, function (response) {
            console.log(response);
        });

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
        let columnNames = Object.keys(currentTableData[0]);

        $modal.open({
            templateUrl : '/static/partials/popup.html',
            controller : 'PopupCtrl',
            resolve : {
                columns : function() {
                    return columnNames;
                }
            }
        }).result.then(function (chartOptions) {
            showChart(currentTableData, chartOptions);
        });
    }
});

controllers.controller('PopupCtrl',function ($scope, $modalInstance, columns) {
    $scope.chartTypes = ['bar','line'];
    $scope.groups = [];
    $scope.values = [];
    $scope.columns = columns;

    $scope.update = function (type) {
        $scope.chartType = type;
    }

    $scope.ok = function() {
        $modalInstance.close({type:$scope.chartType,
            groups:Object.keys($scope.groups),
            values:Object.keys($scope.values)});
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});
