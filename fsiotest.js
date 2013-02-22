var config = require(process.env.HOME + "/.fipconfig.js");
var fsio = require("./fsio");

var client = fsio(config);

client.ticket(8124, function (err, ticket) {
    if (err) {
        console.error(err);
    } else {
        console.log(ticket);
    }
})