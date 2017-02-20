app.controller('PartnerBerlinController', function ($scope, $http, $location, schools, states) {

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
                    "label" : "Gemeinnütziger Akteur" ,
                    "value" : 1070
                } ,
                {
                    "label" : "Öffentliche Infrastruktur" ,
                    "value" : 819
                } ,
                {
                    "label" : "Wirtschaftsakteur" ,
                    "value" : 538
                } ,
                {
                    "label" : "Partnerschule" ,
                    "value" : 258
                } ,
                {
                    "label" : "Modell.Förderprogramm/Projekt" ,
                    "value" : 117
                } ,
                {
                    "label" : "kirchliche Einrichtung" ,
                    "value" :43
                } ,
                {
                    "label" : "Verband/Kammer/Innung/Gewerkschaft" ,
                    "value" : 24
                }
            ]
        }
    ]
});
