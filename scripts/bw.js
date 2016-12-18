jsonfile = require('jsonfile');

var source = __dirname + "/../baden-wuerttemberg/raw/schools.json";
var dest = __dirname + "/../baden-wuerttemberg/all_schools.json";
var school_dest = __dirname + "/../baden-wuerttemberg/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.Schulname,
                id: 'BW-' + item.Schul_ID,
                address: item.Strasse + ', ' + item.PLZ + ' ' + item.Ort,
                school_type: item.Schulform,
                legal_status: item.Status === "p" ? 0 : 1,
                fax: item.Fax,
                phone: item.Telefon
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
