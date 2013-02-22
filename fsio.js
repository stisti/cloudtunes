var request = require("request");
var child_process = require("child_process");
var http = require("http");
var node_static = require("node-static");

function FSIO (config) {
    this._config = config;
    this._ticket = null;
}

// FSIO.prototype.ticket = function (cb) {
//     request.post({
//         url: this._config.apiEndPoint + "/ticket/1_0_0/",
//         json: {
//             AuthenticationToken: this._config.authenticationToken,
//             AuthorizationTicket: this._config.authorizationTicket
//         }
//     }, function (err, resp, body) {
//         if (resp.statusCode == 200) {
//             this._ticket = body;
//             if (cb) {
//                 cb(null, body.Ticket);
//             }
//         } else {
//             if (cb) {
//                 cb(body, null);
//             }
//         }
//     });
// }

// Listen to @port and launch browser to obtain a ticket.
// Finally call @callback with the ticket.
FSIO.prototype.ticket = function (port, callback) {

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

    // Create a static web server
    var file = new(node_static.Server)("./web", {cache: false});

    // Static web server serves a web site to a browser that
    // logs in and acquires an FSIO ticket.
    // The JavsScript in the browser then POSTs the ticket
    // back to this web server.
    http.createServer(function (request, response) {
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
                callback(null, data);
            });
        }
    }).listen(port, function () {
        child_process.exec(urlopener + " http://127.0.0.1:" + port + "/index.html",
                           function (err, stdout, stderr) {
            if (err) {
                console.error("Failed to launch browser:", stderr);
                callback(err, null);
            }
        });
    });
}

function fsio(config) {
    var fsio_ = new FSIO(config);
    return fsio_;
}

module.exports = fsio;
