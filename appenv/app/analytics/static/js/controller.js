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
                jQuery(this).DataTable({
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            text: 'Show Chart',
                            action: function (e, dt) {
                                let data = dt.buttons.exportData();
                                let columnsData = dt.columns().data();
                                let allData = data.header.reduce(function (acc, curr, i) {
                                    acc[curr] = columnsData[i];
                                    return acc;
                                }, {});
                                let excludedCols = ['base_sort_order','concept_id', 'age_group',
                                    'visit_type', 'sort_order'];
                                let chartData = {};
                                for(let key in allData){
                                    if(!excludedCols.includes(key)){
                                        chartData[key] = allData[key];
                                    }
                                }
                                c3.generate({
                                    bindto: '#chart',
                                    data: {
                                        json: chartData,
                                        type: 'bar',
                                    },
                                    axis: { x: {
                                        type: 'category',
                                        categories: [...new Set(chartData["concept_name"])]
                                    }},

                                });
                            }
                        }
                    ]
                });
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
    }
});
