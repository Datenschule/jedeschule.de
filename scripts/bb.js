jsonfile = require('jsonfile');

var source = __dirname + "/../brandenburg/raw/schools.json";
var dest = __dirname + "/../brandenburg/all_schools.json";
var school_dest = __dirname + "/../brandenburg/schools";

jsonfile.readFile(source, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        var result = obj.map((item) => {
            var school = item.info;
            school.provider = item.item['Schulträger'];
            school.address = school.address.split('\n').slice(1).join(' ');
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
