app.factory('breakwordService', function() {

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
        }
    }
});
