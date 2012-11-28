var config = require(process.env.HOME + "/.fipconfig.js");
var fsio = require("./fsio");

var client = fsio(config);

client.ticket(function (err, ticket) {
    if (err) {
        console.error(JSON.stringify(err));
    } else {
        console.log(JSON.stringify(ticket));
    }
})