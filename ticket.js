// Create a static web server
var port = 8124;
var child_process = require("child_process");
var ns = require("node-static");
var file = new(ns.Server)("./web", {cache: false});
require("http").createServer(function (request, response) {
    if (request.method == "GET") {
        request.addListener("end", function () {
            file.serve(request, response);
        });
    } else if (request.method == "POST") {
        var data = "";
        request.setEncoding("utf8");
        request.addListener("data", function (chunk) {
            data += chunk;
        });
        request.addListener("end", function () {
            response.statusCode = 200;
            response.end();
            proceed(data);
        });
    }
}).listen(port, function () {
    child_process.exec("open http://127.0.0.1:" + port + "/index.html",
                       function (err, stdout, stderr) {
        if (err) {
            console.error("Failed to launch browser:", stderr);
        }
    });
});

function proceed(ticket) {
    console.log("Got the ticket", ticket);
}