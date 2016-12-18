jsonfile = require('jsonfile');

var source = __dirname + "/../mecklenburg-vorpommern/raw/schools.json";
var dest = __dirname + "/../mecklenburg-vorpommern/all_schools.json";
var school_dest = __dirname + "/../mecklenburg-vorpommern/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.Schulname,
                id: 'MV-' + item['Dst-Nr.:'],
                address: item['Strasse, Haus-Nr.'] + ', ' + item.Plz + ' ' + item.Ort,
                school_type: item['Schulart/ Org.form'],
                //legal_status: item.Status === "p" ? 0 : 1,
                fax: item.Telefax,
                phone: item.Telefon,
                website: item.Homepage,
                email: item['E-Mail'],
                director: item.Schulleitung.split(',').reverse().join(' ')
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
