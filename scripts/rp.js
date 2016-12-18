jsonfile = require('jsonfile');

var source = __dirname + "/../rheinland-pfalz/raw/schools.json";
var dest = __dirname + "/../rheinland-pfalz/all_schools.json";
var school_dest = __dirname + "/../rheinland-pfalz/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.Name.trim(),
                id: 'RP-' + item['Schul-Nr.'],
                address: item['Straße'].trim() + ', ' + item.Plz.trim() + ' ' + item.Ort.trim(),
                school_type: item.Schulart,
                legal_status: item.Rechtsstatus === "private Schule" ? 0 : 1,
                fax: item['Fax-Nr.'].trim(),
                phone: item['Tel-Nr.'].trim(),
                website: item.Internetadresse,
                email: item['E-Mail']
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
