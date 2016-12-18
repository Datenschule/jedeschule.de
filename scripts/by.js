jsonfile = require('jsonfile');

var source = __dirname + "/../bayern/raw/schools.json";
var dest = __dirname + "/../bayern/all_schools.json";
var school_dest = __dirname + "/../bayern/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.Name,
                id: 'BY-' + item.Schulnummer,
                address: item.Anschrift.replace('\n', ' '),
                school_type: item.Schulart,
                //legal_status: item.Status === "p" ? 0 : 1,
                fax: item.Telefax,
                phone: item.Telefon,
                website: item.website
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
