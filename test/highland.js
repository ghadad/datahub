var _       = require('highland'),
    fs      = require('fs'),
    request = require('request');

// This works but not using the stream approach
// function get(path) {

//     return _(function (push, next) {

//         request(path, function (error, response, body) {
//             // The response itself also contains the body
//             push(error, response);
//             push(null, _.nil);
//         });
//     });
// }

var google = _(request.get('https://raw.githubusercontent.com/codeforamerica/ohana-api/master/data/sample-csv/addresses.csv'));

google
// res is empty array
.map(function (res) {
     console.log("x:",res.toString());
    return res;
})
// res is empty array
.toArray(function (res) {

    console.log(res);
});