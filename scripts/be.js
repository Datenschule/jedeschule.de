jsonfile = require('jsonfile');

var source = __dirname + "/../berlin/raw/schools.json";
var dest = __dirname + "/../berlin/all_schools.json";
var school_dest = __dirname + "/../berlin/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.name,
                id: 'BE-' + item.id,
                address: item.address? item.address.street + ', ' + item.address.postcode + ' ' + 'Berlin' : undefined,
                website: item.website,
                email: item.email,
                school_type: item.type,
                legal_status: item.legal_status === "privat" ? 0 : 1,
                fax: item.fax,
                phone: item.phone,
                director: item.headmaster
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
