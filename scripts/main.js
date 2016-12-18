var geocoder = require('geocoder');
var jsonfile = require('jsonfile');
var throttle = require('promise-ratelimit')(1500);
var nominatim = require('nominatim');

var states = ["baden-wuerttemberg", "bayern", "berlin", "brandenburg", "bremen", "hamburg", "hessen",
                "mecklenburg-vorpommern", "niedersachsen", "nordrhein-westphalen", "rheinland-pfalz",
                "saarland", "sachsen", "sachsen-anhalt", "schleswig-holstein", "thueringen"
            ];
var errors = [];
states.map((state) => {
    jsonfile.readFile(__dirname + "/../" + state + "/all_schools.json", function (err, obj) {
        if (err) {
            console.log(err);
        } else {
            console.log('start geocoding ' + state);
            var geocoded_items = obj.map((item, index) => {
                return new Promise(function(fulfill, reject) {
                    throttle().then(() => {
                        // geocoder.geocode(item.address, function(err, data) {
                        //     //console.log('geocoded ' + item.name);
                        //     if (data.results.length > 0) {
                        //         item.location = data.results[0].geometry.location;
                        //         fulfill(item)
                        //     } else {
                        //         console.log('error geocoding' + item.name);
                        //         fulfill(item)
                        //     }
                        // })
                        nominatim.search({q: item.address}, function(err, opts, results) {
                            //console.log('geocoded ' + item.name);
                            if (results.length > 0) {
                                var result = results[0];
                                item.location = {lat: result.lat, lon: result.lon};
                                fulfill(item)
                            } else {
                                console.log('error geocoding ' + item.name);
                                errors.push(item);
                                fulfill(item)
                            }
                            if (index % 50 == 0) {
                                console.log('coded ' + index + ' of ' + obj.length + ' items')
                            }
                        });
                    });
                })
            });
            Promise.all(geocoded_items).then((data) => {
                jsonfile.writeFile(__dirname + "/../" + state + "/all_schools_geocoded.json", data, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('geocoded ' + state + ' successfully')
                    }
                });
            }).then(() => {
                jsonfile.writeFile(__dirname + "/../error.json", errors, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('created errorfile')
                    }
                });
            }).catch(console.log);
        }
    })
});
// geocoder.geocode('29 champs elysée paris', function(err, res) {
//     console.log(res);
// });
// nominatim.search({ q: 'Rombacher Straße 30, 73430 Aalen'}, function(err, opts, results) {
//     console.log(results);
// });
