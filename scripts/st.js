jsonfile = require('jsonfile');

var source = __dirname + "/../sachsen-anhalt/raw/schools.json";
var dest = __dirname + "/../sachsen-anhalt/all_schools.json";
var school_dest = __dirname + "/../sachsen-anhalt/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item, index) => {
            var school = {
                name: item.Name,
                id: 'ST-' + index,
                address: item.Adresse,
                //school_type: item.Schulform,
                //legal_status: item.Status === "p" ? 0 : 1,
                fax: item.Telefax,
                phone: item.Telefon,
                email: item['E-Mail'],
                website: item.Homepage
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
