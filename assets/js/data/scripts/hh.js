jsonfile = require('jsonfile');

var source = __dirname + "/../hamburg/raw/schools.json";
var dest = __dirname + "/../hamburg/all_schools.json";
var school_dest = __dirname + "/../hamburg/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.Name,
                id: 'HH-' + item.Schulnummer,
                address: item.Strasse + ' ' + item.Hausnummer + ', ' + item.PLZ + ' ' + item.Ort,
                school_type: item.schulform,
                legal_status: item.status === "privat" ? 0 : 1,
                fax: item.Fax,
                phone: item.Telefon,
                website: item.Homepage,
                email: item.email,
                provider: item.Traeger,

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
