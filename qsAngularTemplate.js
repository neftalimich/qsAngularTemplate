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
            });
            // ------------------------------- 
        }]
    };
});