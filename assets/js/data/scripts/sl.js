jsonfile = require('jsonfile');

var source = __dirname + "/../saarland/raw/schools.json";
var dest = __dirname + "/../saarland/all_schools.json";
var school_dest = __dirname + "/../saarland/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item['Bezeichnung der Schule'],
                id: 'SL-' + item.Gemeindenummer + '-' +item.Schulkenziffer ,
                address: item.Strasse + ', ' + item.PLZ + ' ' + item['Stadt/Gemeinde'],
                school_type: item.Schultyp,
                legal_status: item['Trägerschaft'] === "privat" ? 0 : 1,
                fax: item.Fax,
                phone: item.Telefon,
                email: item.Email
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
