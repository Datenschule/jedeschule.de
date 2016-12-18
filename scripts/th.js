jsonfile = require('jsonfile');

var source = __dirname + "/../thueringen/raw/schools.json";
var dest = __dirname + "/../thueringen/all_schools.json";
var school_dest = __dirname + "/../thueringen/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        result = obj.map((item) => {
            var school = {
                name: item.Schulname,
                id: 'TH-' + item.Schulnummer,
                address: item['Straße'] + ', ' + item.Ort,
                school_type: item.Schulform,
                legal_status: item.Status === "p" ? 0 : 1,
                fax: item.Fax,
                phone: item.Telefon,
                email: decryptZD(item['E-Mail'].split(';')[1]),
                provider: item['Schulträger']
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

//Decryption of email address
function decryptZD(a) {
    if (a) {
        result = "";
        a = a.replace(/ /g, "");
        a = a.replace(/#3b/, "");
        a = a.replace(/3e#/, "");
        a = a.replace(/o/g, "");
        lastValue = 0;
        currentValue = 0;
        for (i = 0; i < a.length; i++) {
            if (isNaN(a.charAt(i))) {
                currentValue = (a.charCodeAt(i) - 97) + 10
            } else {
                currentValue = a.charAt(i)
            }
            if (i % 2 == 1) {
                result += String.fromCharCode(parseInt((parseInt(lastValue * 23) + parseInt(currentValue)) / 2))
            }
            lastValue = currentValue
        }
        return result
    }
    return undefined;
}

