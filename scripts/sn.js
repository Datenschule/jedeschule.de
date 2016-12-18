jsonfile = require('jsonfile');

var source = __dirname + "/../sachsen/raw/schools.json";
var dest = __dirname + "/../sachsen/all_schools.json";
var school_dest = __dirname + "/../sachsen/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.title,
                id: 'SN-' + item['Dienststellenschlüssel'],
                address: item.Postanschrift,
                school_type: item.Einrichtungsart.replace('Allgemeinbildende Schule', '').replace('Berufsbildende Schule').trim(),
                legal_status: item.Rechtsstellung === "Einrichtung in freier Trägerschaft" ? 0 : 1,
                fax: item.Telefax,
                phone: item.phone_numbers[Object.keys(item.phone_numbers)[0]], //first phone number,
                website: item.Homepage,
                email: item['E-Mail'],
                provider: item['Schulträger'],
                director: item['Schulleiter']
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
