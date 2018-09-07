define([
    "qlik",
    "jquery",
    "./initial-properties",
    "./properties",
    "text!./style.css",
    "text!./template.html",
    "./js/highcharts"
], function (qlik, $, initProps, props, cssContent, template, highcharts) {
    'use strict';
    $("<style>").html(cssContent).appendTo("head");
    $('<link rel="stylesheet" type="text/css" href="/extensions/qsAngularTemplate/css/font-awesome.css">').html("").appendTo("head");
    return {
        template: template,
        initialProperties: initProps,
        definition: props,
        support: {
            snapshot: true,
            export: true,
            exportData: true
        },
        paint: function () {
            //setup scope.table
            if (!this.$scope.table) {
                this.$scope.table = qlik.table(this);
                console.log("qsAngularTemplate - Table", this.$scope.table);
            }
            return qlik.Promise.resolve();
        },
        controller: ['$scope', function ($scope) {
            console.log("qsAngularTemplate - layout", $scope.layout);

            // ------------------------------- Watchers
            $scope.$watchCollection("layout.qHyperCube.qDataPages", function (newValue) {
                $scope.SetTableIndex();
            });

            $scope.$watchCollection("layout.qHyperCube.qDimensionInfo", function (newValue) {

            });
            $scope.$watchCollection("layout.qHyperCube.qMeasureInfo", function (newValue) {

            });
            // -------------------------------

            // ------------------------------- qAttrExps
            // 0. Class by each row - qAttributeExpressions.0.qExpression
            // 1. qAttributeExpressions.1.qExpression
            // Etc.
            $scope.tableIndex = [];
            $scope.SetTableIndex = function () {
                $scope.tableIndex = [];
                angular.forEach($scope.layout.qHyperCube.qDataPages, function (qDataPage, key) {
                    let pageKey = key;
                    angular.forEach(qDataPage.qMatrix, function (row, key) {
                        $scope.tableIndex.push({
                            page: pageKey,
                            index: key
                        });
                    });
                });
                //console.log("tableIndex", $scope.tableIndex);
            };
            // -------------------------------
            $scope.GetMoreData = function () {
                //$scope.ReloadCube();
                if ($scope.layout.props.chart.show) {
                    $scope.NextPageCube2();
                }
                return true;
            };
            // -------------------------------

            // ------------------------------- CUBE 2
            var qDimensionTemplate = {
                qDef: {
                    qGrouping: "N",
                    qFieldDefs: "CHANGE_ME",
                    qFieldLabels: [""],
                    autoSort: false,
                    qSortCriterias: [
                        {
                            qSortByAscii: 0
                        }
                    ]
                },
                qNullSuppression: true
            };
            var qMeasureTemplate = {
                qDef: {
                    qLabel: "",
                    qDescription: "",
                    qTags: [""],
                    qGrouping: "N",
                    qDef: "CHANGE_ME",
                    qNumFormat: {
                        qDec: ".",
                        qFmt: "#,##0.00",
                        qThou: ",",
                        qType: "F",
                        qUseThou: 0,
                        qnDec: 2
                    },
                    autoSort: false
                },
                qAttributeExpressions: [],
                qSortBy: {
                    qSortByState: 0,
                    qSortByFrequency: 0,
                    qSortByNumeric: 0,
                    qSortByAscii: 0,
                    qSortByLoadOrder: 0,
                    qSortByExpression: 0,
                    qExpression: {
                        qv: ""
                    }
                }
            };

            // ------------------------------- Watchers 2
            $scope.$watchCollection("layout.cube2Dimensions", function (newVal) {
                let qDimensions = [];
                angular.forEach(newVal, function (value, key) {
                    if (value.dimension != "") {
                        let qDimAux = JSON.parse(JSON.stringify(qDimensionTemplate));
                        qDimAux.qDef.qLabel = [value.label];
                        qDimAux.qDef.qFieldDefs = [value.dimension];
                        qDimensions.push(qDimAux);
                    }
                });

                $scope.backendApi.applyPatches([
                    {
                        "qPath": "/cube2/qHyperCubeDef/qDimensions",
                        "qOp": "replace",
                        "qValue": JSON.stringify(qDimensions)
                    }
                ], false);
            });
            $scope.$watchCollection("layout.cube2Measures", function (newVal) {
                let qMeasures = [];
                angular.forEach(newVal, function (value, key) {
                    if (value.measure != "") {
                        let qMeaAux = JSON.parse(JSON.stringify(qMeasureTemplate));
                        qMeaAux.qDef.qLabel = value.label;
                        qMeaAux.qDef.qDef = value.measure;
                        qMeaAux.qDef.qNumFormat.qType = value.qType ? value.qType : "F";
                        qMeaAux.qDef.qNumFormat.qFmt = value.qFmt ? value.qFmt : "#,##0.00";
                        qMeaAux.qDef.qNumFormat.qnDec = value.qnDec ? value.qnDec : 2;
                        qMeaAux.qAttributeExpressions.push({ qExpression: value.pointBackgroundColor });
                        qMeaAux.qAttributeExpressions.push({ qExpression: value.pointBorderColor });
                        qMeasures.push(qMeaAux);
                    }
                });

                $scope.backendApi.applyPatches([
                    {
                        "qPath": "/cube2/qHyperCubeDef/qMeasures",
                        "qOp": "replace",
                        "qValue": JSON.stringify(qMeasures)
                    }
                ], false);
            });
            $scope.$watchCollection("layout.cube2.qHyperCube.qDataPages", function (newVal) {
                $scope.ActiveCharts();
            });
            $scope.$watchCollection("layout.props.chart", function (newVal) {
                $scope.ActiveCharts();
            });
            // ------------------------------- 

            // ------------------------------- Chart
            $scope.ActiveCharts = function () {
                if ($scope.layout.props.chart.show) {
                    angular.element(document).ready(function () {
                        if ($scope.qDataPagesCube2.length > 0) {
                            $scope.qDataPagesCube2[0] = JSON.parse(JSON.stringify($scope.layout.cube2.qHyperCube.qDataPages[0]));
                        } else {
                            $scope.qDataPagesCube2.push(JSON.parse(JSON.stringify($scope.layout.cube2.qHyperCube.qDataPages[0])));
                        }
                        $scope.GroupChartData();
                        $scope.LoadCharts();
                    });
                }
            };

            $scope.currentPage = 1;
            $scope.qDataPagesCube2 = [];
            $scope.NextPageCube2 = function () {
                let requestPage = [{
                    qTop: $scope.layout.cube2.qHyperCube.qDataPages[0].qArea.qHeight * $scope.currentPage,
                    qLeft: 0,
                    qWidth: $scope.layout.cube2.qHyperCube.qDataPages[0].qArea.qWidth,
                    qHeight: $scope.layout.cube2.qHyperCube.qDataPages[0].qArea.qHeight
                }];

                $scope.ext.model.getHyperCubeData('/cube2/qHyperCubeDef', requestPage).then(function (value) {
                    //console.log("page " + $scope.currentPage, value[0]);
                    if ($scope.qDataPagesCube2.length == $scope.currentPage) {
                        $scope.qDataPagesCube2.push(value[0]);
                    } else {
                        $scope.qDataPagesCube2[$scope.currentPage] = value[0];
                    }
                    $scope.currentPage += 1;
                    $scope.GroupChartData();
                    $scope.LoadCharts();
                });
            };

            $scope.GroupChartData = function () {
                if ($scope.layout.cube2.qHyperCube.qDimensionInfo.length > 0) {
                    if ($scope.layout.cube2.qHyperCube.qDataPages[0].qMatrix[0].length > 2) {
                        let qMatrixCopy = [];
                        angular.forEach($scope.qDataPagesCube2, function (qDataPage, key) {
                            qMatrixCopy.push.apply(qMatrixCopy, JSON.parse(JSON.stringify(qDataPage.qMatrix)));
                        });
                        let groups = qMatrixCopy.reduce(function (obj, item) {
                            obj[item[0].qText] = obj[item[0].qText] || [];
                            obj[item[0].qText].push(item);
                            return obj;
                        }, {});
                        $scope.dataGrouped = Object.keys(groups).map(function (key) {
                            return { name: key, data: groups[key] };
                        });

                        angular.forEach($scope.dataGrouped, function (value, key) {
                            value.data.sort(function compare(a, b) {
                                if (a[1].qNum < b[1].qNum)
                                    return -1;
                                if (a[1].qNum > b[1].qNum)
                                    return 1;
                                return 0;
                            });
                        });
                    }
                    //console.log($scope.dataGrouped);
                }
            };

            $scope.LoadCharts = function () {
                //console.log($scope.dataGrouped);
                let dimLength = $scope.layout.cube2.qHyperCube.qDimensionInfo.length;
                let meaLength = $scope.layout.cube2.qHyperCube.qMeasureInfo.length;

                let seriesAux = [];
                angular.forEach($scope.layout.cube2.qHyperCube.qMeasureInfo, function (measure, key) {
                    seriesAux.push({
                        name: measure.qFallbackTitle,
                        data: [],
                        lineWidth: 1,
                        showInLegend: false
                    });
                });

                angular.forEach($scope.dataGrouped, function (group, keyGroup) {
                    let categoriesAux = [];
                    angular.forEach(seriesAux, function (serieAux, keySerie) {
                        serieAux.data = [];
                    });

                    angular.forEach(group.data, function (item, keyItem) {
                        for (let i = dimLength; i < dimLength + meaLength; i++) {
                            seriesAux[i - dimLength].data.push({
                                y: parseFloat(item[i].qText),
                                color: item[i].qText,
                                marker: {
                                    enabled: true,
                                    fillColor: item[i].qAttrExps.qValues[0].qText,
                                    lineColor: item[i].qAttrExps.qValues[1].qText,
                                    lineWidth: 2,
                                    radius: 3,
                                    states: {
                                        hover: {
                                            fillColor: item[i].qAttrExps.qValues[0].qText,
                                            lineColor: item[i].qAttrExps.qValues[1].qText,
                                            radius: 5
                                        }
                                    }
                                }
                            });
                        }
                        categoriesAux.push(item[dimLength - 1].qText);
                    });

                    //console.log("seriesAux", group.name, seriesAux);

                    let xAxisAux = {
                        categories: categoriesAux,
                        title: { text: null },
                        labels: { enabled: false },
                        lineWidth: 0,
                        lineColor: 'transparent',
                        tickLength: 0,
                        gridLineColor: 'transparent',
                        gridLineWidth: 0,
                        visible: false
                    };
                    let yAxisAux = {
                        title: { text: null },
                        labels: { enabled: false },
                        lineWidth: 0,
                        lineColor: 'transparent',
                        tickLength: 0,
                        gridLineColor: 'transparent',
                        gridLineWidth: 0,
                        visible: false
                    };

                    //console.log(group.name, categoriesAux, seriesAux[0]);
                    let ctx = $("#chart-" + group.name);
                    if (ctx.length) {
                        let chart = new Highcharts.Chart({
                            chart: {
                                type: 'spline',
                                renderTo: 'chart-' + group.name,
                                title: '',
                                zoomType: 'xy',
                                animation: false,
                                backgroundColor: 'rgba(0, 0, 0, 0.0)',
                                margin: [2, 2, 2, 2]
                            },
                            title: {
                                text: null
                            },
                            legend: { enabled: false },
                            xAxis: xAxisAux,
                            yAxis: yAxisAux,
                            series: seriesAux,
                            tooltip: { enabled: false },
                            credits: {
                                enabled: false
                            }
                        });
                    }
                });
            };
            // ------------------------------- 
        }]
    };
});