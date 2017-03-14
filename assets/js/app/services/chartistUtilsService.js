app.factory('chartistUtilsService', function($window) {

    return {
        breakSchooltype: function(s) {
            var breakwords = {
                "Grundschulen": 'Grund&shy;schulen',
                "Hauptschulen": 'Haupt&shy;schulen',
                "Abendschulen und Kollegs": 'Abend&shy;schulen und Kollegs',
                "Freie Waldorfschulen": 'Freie Waldorf&shy;schulen',
                "Realschulen": 'Real&shy;schulen',
                "Förderschulen": 'Förder&shy;schulen',
                "Schulkindergärten": 'Schul&shy;kinder&shy;gärten',
                "Integrierte Gesamtschulen": 'Integrierte Gesamt&shy;schulen',
                "Schularten mit mehreren Bildungsgängen": 'Schul&shy;arten mit mehreren Bildungs&shy;gängen',
                "Schulartunabhängige Orientierungsstufe": 'Schulart&shy;unabhängige Orientierungs&shy;stufe'
            };
            var broken = breakwords[s];
            if (broken) return broken;
            return s;
        },
        rotateLabelAwareDraw: function(ctx) {
            if (//chart.supportsForeignObject === false &&
            ctx.type === 'label' &&
            ctx.axis.units.pos === Chartist.Axis.units.x.pos) {
                var element = angular.element(ctx.element._node);
                var computedStyle = $window.getComputedStyle(element[0]);
                //text-align on the svg foreign object is only "right" on small screens => label rotated
                if (computedStyle.textAlign == 'right') {
                    // adjust label position for rotation
                    var lineheight = 16;
                    var dX = (ctx.width / 2 ) - (lineheight / 2);
                    var x = parseFloat(ctx.element.attr('x'));
                    ctx.element.attr({x: x + dX});
                }
            }
        }
    }
});
