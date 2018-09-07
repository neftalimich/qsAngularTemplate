define([], function () {
    "use strict";

    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 1,
                items: {
                    textAlign: {
                        type: "string",
                        component: "dropdown",
                        label: "Text Align",
                        ref: "qDef.pTextAlign",
                        options: [
                            {
                                value: "text-left",
                                label: "Izquierda"
                            },
                            {
                                value: "text-center",
                                label: "Centro"
                            }, {
                                value: "text-right",
                                label: "Derecha"
                            }
                        ],
                        defaultValue: "text-left"
                    },
                    textClass: {
                        type: "string",
                        label: "Text Class",
                        ref: "qDef.pTextClass",
                        defaultValue: ""
                    },
                    type: {
                        type: "string",
                        component: "radiobuttons",
                        label: "Type of Value",
                        ref: "qDef.pType",
                        options: [{
                            value: 0,
                            label: "Normal"
                        }, {
                            value: 1,
                            label: "HTML"
                        }, {
                            value: 2,
                            label: "Icon"
                        }],
                        defaultValue: 0
                    },
                    columnSize: {
                        type: "string",
                        ref: "qDef.pColumnSize",
                        label: "Column Size (px & %)",
                        defaultValue: ""
                    }
                }
            },
            measures: {
                uses: "measures",
                min: 1,
                items: {
                    textAlign: {
                        type: "string",
                        component: "dropdown",
                        label: "Text Align",
                        ref: "qDef.pTextAlign",
                        options: [
                            {
                                value: "text-left",
                                label: "Izquierda"
                            },
                            {
                                value: "text-center",
                                label: "Centro"
                            }, {
                                value: "text-right",
                                label: "Derecha"
                            }
                        ],
                        defaultValue: "text-center"
                    },
                    expressionClass: {
                        type: "string",
                        component: "expression",
                        ref: "qAttributeExpressions.0.qExpression",
                        label: "Expression Class by Row",
                        expression: "optional",
                        defaultValue: ""
                    },
                    textClass: {
                        type: "string",
                        label: "Text Class",
                        ref: "qDef.pTextClass",
                        defaultValue: ""
                    },
                    type: {
                        type: "string",
                        component: "radiobuttons",
                        label: "Type of Value",
                        ref: "qDef.pType",
                        options: [{
                            value: 0,
                            label: "Normal"
                        }, {
                            value: 1,
                            label: "HTML"
                        }, {
                            value: 2,
                            label: "Icon"
                        }],
                        defaultValue: 0
                    },
                    columnSize: {
                        type: "number",
                        ref: "qDef.pColumnSize",
                        label: "Column Size",
                        defaultValue: 0
                    }
                }
            },
            sorting: {
                uses: "sorting"
            },
            cube2props: {
                label: "Cube 2",
                type: "items",
                items: {
                    Dimensions: {
                        type: "array",
                        ref: "cube2Dimensions",
                        label: "List of Dimensions",
                        itemTitleRef: "label",
                        allowAdd: true,
                        allowRemove: true,
                        addTranslation: "Add Dimension",
                        items: {
                            dimension: {
                                type: "string",
                                ref: "dimension",
                                label: "Dimension Expression",
                                expression: "always",
                                expressionType: "dimension"
                            },
                            label: {
                                type: "string",
                                ref: "label",
                                label: "Label",
                                expression: "optional"
                            }
                        }
                    },
                    Measures: {
                        type: "array",
                        ref: "cube2Measures",
                        label: "List of Measures",
                        itemTitleRef: "label",
                        allowAdd: true,
                        allowRemove: true,
                        addTranslation: "Add Measure",
                        items: {
                            measure: {
                                type: "string",
                                ref: "measure",
                                label: "Measure Expression",
                                expression: "always",
                                expressionType: "measure"
                            },
                            label: {
                                type: "string",
                                ref: "label",
                                label: "Label",
                                expression: "optional"
                            },
                            qType: {
                                type: "string",
                                ref: "qType",
                                label: "qType",
                                defaultValue: "F"
                            },
                            qFmt: {
                                type: "string",
                                ref: "qFmt",
                                label: "qFmt",
                                defaultValue: "#,##0.00"
                            },
                            qnDec: {
                                type: "integer",
                                ref: "qnDec",
                                label: "qnDec",
                                defaultValue: 2
                            },
                            pointBackgroundColor: {
                                type: "string",
                                component: "expression",
                                ref: "pointBackgroundColor",
                                label: "Point Background Color",
                                expression: "optional",
                                defaultValue: ""
                            },
                            pointBorderColor: {
                                type: "string",
                                component: "expression",
                                ref: "pointBorderColor",
                                label: "Point Border Color",
                                expression: "optional",
                                defaultValue: ""
                            }
                        }
                    }
                }
            },
            settings: {
                uses: "settings",
                items: {
                    initFetch: {
                        type: "items",
                        label: "Intial Fetch",
                        items: {
                            initFetchCols: {
                                ref: "qHyperCubeDef.qInitialDataFetch.0.qWidth",
                                label: "Cube 1 - Initial fetch cols",
                                type: "number",
                                defaultValue: 15
                            },
                            initFetchRows: {
                                ref: "qHyperCubeDef.qInitialDataFetch.0.qHeight",
                                label: "Cube 1 - Initial fetch rows",
                                type: "number",
                                defaultValue: 50
                            },
                            initFetchCols2: {
                                ref: "cube2.qHyperCubeDef.qInitialDataFetch.0.qWidth",
                                label: "Cube 2 - Initial fetch cols",
                                type: "number",
                                defaultValue: 5
                            },
                            initFetchRows2: {
                                ref: "cube2.qHyperCubeDef.qInitialDataFetch.0.qHeight",
                                label: "Cube 2 -Initial fetch rows",
                                type: "number",
                                defaultValue: 2000
                            }
                        }
                    },
                    General: {
                        type: "items",
                        label: "Table Configuration",
                        items: {
                            showTotals: {
                                type: "boolean",
                                component: "switch",
                                ref: "props.showTotals",
                                label: "Show Totals",
                                options: [{
                                    value: true,
                                    label: "Yes"
                                }, {
                                    value: false,
                                    label: "No"
                                }],
                                defaultValue: true
                            },
                            labelTotals: {
                                type: "string",
                                ref: "props.labelTotals",
                                label: "Label Totals",
                                defaultValue: "Totals"
                            },
                            columnOrder: {
                                type: "string",
                                ref: "props.columnOrder",
                                label: "Column Order",
                                defaultValue: "0,1,2"
                            }
                        }
                    },
                    Chart: {
                        type: "items",
                        label: "Chart Configuration",
                        items: {
                            showChart: {
                                type: "boolean",
                                component: "switch",
                                ref: "props.chart.show",
                                label: "Show Charts",
                                options: [{
                                    value: true,
                                    label: "Yes"
                                }, {
                                    value: false,
                                    label: "No"
                                }],
                                defaultValue: true
                            },
                            labelCharts: {
                                type: "string",
                                ref: "props.chart.label",
                                label: "Label Charts",
                                defaultValue: "Chart"
                            }
                        }
                    }
                }
            }
        }
    };
});