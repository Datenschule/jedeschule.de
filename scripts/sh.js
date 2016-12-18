jsonfile = require('jsonfile');

var source = __dirname + "/../schleswig-holstein/raw/schools.json";
var dest = __dirname + "/../schleswig-holstein/all_schools.json";
var school_dest = __dirname + "/../schleswig-holstein/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.Name,
                id: 'SH-' + item['Dienststellen Nr.'],
                address: item['Straße'] + ', ' + item.PLZ + ' ' + item.Ort,
                school_type: item.Organisationsform,
                legal_status: item.Rechtsstatus === "privat" ? 0 : 1,
                fax: item.Fax,
                phone: item.Telefon,
                email: item.Email,
                provider: item['Träger'],
                director: item['Schulleiter(-in)']
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
