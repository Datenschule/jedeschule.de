jsonfile = require('jsonfile');

var source = __dirname + "/../nordrhein-westphalen/raw/schools.json";
var dest = __dirname + "/../nordrhein-westphalen/all_schools.json";
var school_dest = __dirname + "/../nordrhein-westphalen/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item['Amtliche Bezeichnung'],
                id: 'NRW-' + item.Schulnummer,
                address: item['Straße'] + ', ' + item['Plz und Ort'],
                school_type: item.Schulform,
                //legal_status: item.Status === "p" ? 0 : 1,
                fax: item.Fax,
                phone: item.Telefon,
                website: item.Internet,
                email: item['E-Mail-Adresse']
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
