var request = require("request");

function FSIO (config) {
    this.config = config;
    this.ticket = null;
}

FSIO.prototype.ticket = function (cb) {
    request.post({
        url: config.apiEndPoint + "/ticket/1_0_0/",
        json: {
            authenticationToken: config.authenticationToken,
            authorizationTicket: config.authorizationTicket
        }
    }, function (err, resp, body) {
        if (resp.statusCode == 200) {
            this.ticket = body;
            if (cb) {
                cb(null, body.Ticket);
            }
        } else {
            if (cb) {
                cb(body, null);
            }
        }
    });
}

function fsio(config) {
    var fsio_ = new FSIO(config);
    return fsio_;
}

module.exports = fsio;
