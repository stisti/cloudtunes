var request = require("request");

function FSIO (config) {
    this._config = config;
    this._ticket = null;
}

FSIO.prototype.ticket = function (cb) {
    console.log(this._config.authenticationToken);
    console.log(this._config.authorizationTicket);
    request.post({
        url: this._config.apiEndPoint + "/ticket/1_0_0/",
        json: {
            AuthenticationToken: this._config.authenticationToken,
            AuthorizationTicket: this._config.authorizationTicket
        }
    }, function (err, resp, body) {
        if (resp.statusCode == 200) {
            this._ticket = body;
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
