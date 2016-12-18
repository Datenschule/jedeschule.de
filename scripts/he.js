jsonfile = require('jsonfile');

var source = __dirname + "/../hessen/raw/schools.json";
var dest = __dirname + "/../hessen/all_schools.json";
var school_dest = __dirname + "/../hessen/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        var keys = ['Grundschulen', 'Förderstufe', 'Hauptschule', 'Mittelstufen-schule', 'Realschule',
            'Integrierte Jahrgangs-stufe', 'Gymnasien', 'Förderschulen', 'Schulen für Erwachsene'];
        // split into one school per schooltype
        var schools = obj.reduce((prev, school) => {
            keys.map((key) => {
                if (school[key] !== "") {
                    school.type = key;
                    school['Anzahl Schüler'] = parseInt(school[key]);
                    prev.push(school);
                }
            })
            return prev;
        }, []);
        //delete unnecessary attributes
        schools = schools.map((school) => {
            keys.map((key) => {
                delete school[key]
            });
            return school;
        });
        var result = schools.map((item) => {
            var school = {
                name: item['Name der Schule'],
                id: 'HE-' + item['Schul-nummer'],
                address: item['Straße, Hausnummer'] + ', ' + item.PLZ + ' ' + item.Schulort,
                school_type: item.type,
                fax: item['Telefon-vorwahl'] + '/' + item.Fax,
                phone: item['Telefon-vorwahl'] + '/' + item['Telefon-nummer']
            };
            jsonfile.writeFile(school_dest + '/' + school.id + '.json', school, (err) => {
                if (err)
                    console.log(err);
            });
            return school
        });
        jsonfile.writeFile(dest, result, (err) => {
            if (err)
                console.log(err);
            console.log('successful')
        });
    }
});
