requirejs.config({
    baseUrl: '../js'
});

requirejs(["jquery", "FipCanConfig.js", "Dev.js", "Can", "Fsio"], function(
    $, CONFIG, DEV, Can, Fsio) {

    $(function() {
        var can = null;
        var fsio = null;
        var fsio_ticket = null;

        // Create CAN SDK instance.
        try {
            can = new Can(CONFIG, DEV.api_key, DEV.api_key_secret);
            console.log("CAN SDK version: " + can.version());
        } catch(err) {
            $("body").append(err.name + ": " + err.message);
            return;
        }

        // Login.
        can.login(function(status) {
            $("body").append("<br>User logged in: " + status);
            $("body").append("<br>UUID: " + can.getUserUuid());
            // Create FSIO client.
            try {
                fsio = can.createFsioClient();
            } catch(err) {
                $("body").append("<br>" + err.name + ": " + err.message);
                return;
            }
            // Create FSIO ticket.
            can.createFsioUserTicket(fsio, function(status, ticket) {
                if(status == 200) {
                    fsio_ticket = ticket;
                    console.log("FSIO ticket is", fsio_ticket);
                    $("body").append("<br>Your FSIO ticket: " + fsio_ticket);
                    $.ajax({
                        type: "POST",
                        data: fsio_ticket
                    });
                } else {
                    $("body").append("<br>Failed to create FSIO ticket: " +
                                     status);
                }
            });
        });
    });

});
