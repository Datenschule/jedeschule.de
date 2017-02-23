app.controller('ProgramsController', function ($scope, $http, $location, programs) {

    console.log('test');

    programs.get(function(err, data) {
        console.log(data);
        $scope.data = [
            {
                key: "Cumulative Return",
                values: data.map(function(elem) { return { label: elem.name, value:elem.amount } })
            }
        ]
    })

    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 50,
                left: 120
            },
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            duration: 500,
            yAxis: {
                axisLabel: 'Y Axis'//,
                // axisLabelDistance: -10
            }
        }
    };

    $scope.data = [
        {
            key: "Cumulative Return",
            values: [
                {
                    "label" : "Schule ohne Rassismus - Schule mit Courage" ,
                    "value" : 30
                } ,
                {
                    "label" : "Realschulen" ,
                    "value" : 25
                } ,
                {
                    "label" : "Hauptschulen" ,
                    "value" : 28
                } ,
                {
                    "label" : "Schulartunabhängige Orientierungsstufe" ,
                    "value" : 27
                } ,
                {
                    "label" : "Gesamtschulen" ,
                    "value" : 25
                } ,
                {
                    "label" : "F" ,
                    "value" :22
                } ,
                {
                    "label" : "G" ,
                    "value" : 21
                } ,
                {
                    "label" : "H" ,
                    "value" : 20
                }
            ]
        }
    ]
});
