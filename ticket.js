// Listen to @port and launch browser to obtain a ticket.
// Finally call @callback with the ticket.
function FsioTicket(port, callback) {
    var child_process = require("child_process");

    // Create a static web server
    var ns = require("node-static");
    var file = new(ns.Server)("./web", {cache: false});

    // Static web server serves a web site to a browser that
    // logs in and acquires an FSIO ticket.
    // The JavsScript in the browser then POSTs the ticket
    // back to this web server.
    require("http").createServer(function (request, response) {
        if (request.method == "GET") {
            // Serving the web site for the browser
            request.addListener("end", function () {
                file.serve(request, response);
            });
        } else if (request.method == "POST") {
            // Receiving the ticket from the browser
            var data = "";
            request.setEncoding("utf8");
            request.addListener("data", function (chunk) {
                data += chunk;
            });
            request.addListener("end", function () {
                response.statusCode = 200;
                response.end();
                // Deliver the ticket
                callback(data);
            });
        }
    }).listen(port, function () {
        var urlopener = null;
        if (process.platform == "darwin") {
            urlopener = "open";
        } else if (process.platform == "linux") {
            urlopener = "xdg-open";
        } else if (process.platform == "win32") {
            urlopener = "start"
        } else {
            throw new Error("Don't know how to open web pages in platform " + process.platform);
        }
        child_process.exec(urlopener + " http://127.0.0.1:" + port + "/index.html",
                           function (err, stdout, stderr) {
            if (err) {
                console.error("Failed to launch browser:", stderr);
            }
        });
    });
}

module.exports = FsioTicket;
