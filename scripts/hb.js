jsonfile = require('jsonfile');

var source = __dirname + "/../bremen/raw/schools.json";
var dest = __dirname + "/../bremen/all_schools.json";
var school_dest = __dirname + "/../bremen/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            // var ansprechpersonen = item['Ansprechperson'].replace('Schulleitung:', '').replace('Vertretung:', ',').split(',')
            // item['Schulleitung'] = ansprechpersonen[0];
            // item['Vertretung'] = ansprechpersonen[1];
            var school = {
                name: item.Name1,
                id: 'HB-' + item.Schulnummer,
                address: item.Strasse + ', ' + item.PLZ + ' ' + item.Ort,
                school_type: item.Schulform,
                //legal_status: item.Status === "p" ? 0 : 1,
                fax: item.Vorwahl + '/' + item.Fax,
                phone: item.Vorwahl + '/' + item.Telefon,
                //website: item.Internet,
                email: item.EMail,
                director: item.SchulleiterVorname + ' ' + item.SchulleiterName
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
