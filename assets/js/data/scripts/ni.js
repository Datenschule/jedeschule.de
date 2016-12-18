jsonfile = require('jsonfile');

var source = __dirname + "/../niedersachsen/raw/schools.json";
var dest = __dirname + "/../niedersachsen/all_schools.json";
var school_dest = __dirname + "/../niedersachsen/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.Schule,
                id: 'NI-' + item.Schulnummer,
                address: item['Straße'] + ', ' + item.Ort,
                school_type: item['Schul-gliederung(en)'],
                //legal_status: item.Status === "p" ? 0 : 1,
                //fax: item.Fax,
                phone: item.Tel,
                website: item.homepage,
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
