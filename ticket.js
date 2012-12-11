// Create a static web server
var port = 8845;
var child_process = require("child_process");
var ns = require("node-static");
var file = new(ns.Server)("./web", {cache: false});
require("http").createServer(function (request, response) {
    request.addListener("end", function () {
        file.serve(request, response);
    })
}).listen(port, function () {
    child_process.exec("open http://localhost:" + port + "/index.html",
                       function (err, stdout, stderr) {
        if (err) {
            console.error("Failed to launch browser:", stderr);
        }
    })
});