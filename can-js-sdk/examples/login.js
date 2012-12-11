requirejs.config({
    baseUrl: '../js'
});

requirejs(["jquery", "FipCanConfig.js", "Dev.js", "Can", "Fsio"], function(
    $, CONFIG, DEV, Can, Fsio) {

    function randomString(len) {
        len = len ? len : 20;
        var s = "";
        var chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i=0; i < len; i++)
            s += chars.charAt(Math.floor(Math.random() * chars.length));
        return s;
    }

    function getFsioUserAccountInfo(ctx) {
        ctx.fsio.content.getUserAccountInfo(ctx.ticket, function(jqXHR) {
            $("body").append("<br><br>" + jqXHR.responseText);
        });
    }

    function deleteFile(ctx, object) {
        ctx.fsio.content.deleteFile(ctx.ticket, object, function(jqXHR) {
            $("body").append("<br><br>Deleted '" + object + "': " +
                             jqXHR.status);
        });
    }

    function downloadFile(ctx, object) {
        ctx.fsio.data.download(ctx.ticket, object, function(jqXHR) {
            $("body").append("<br><br>Downloaded '" + object + "': " +
                             jqXHR.status);
            $("body").append("<br><br>" + jqXHR.responseText);
            deleteFile(ctx, object);
        });
    }

    function waitUntilScanned(ctx, object) {
        ctx.fsio.waitForWorkers(ctx.ticket, object,
                                ["AV","FileTypeWorkerStatus","MetadataWorkerStatus"],
                                10, function(status) {
                                    if(status == "success")
                                        downloadFile(ctx, object);
                                });
    }

    function uploadFilePartially(ctx) {
        var object_name = randomString() + "_" + new Date().getTime();
        ctx.fsio.data.partialUploadInit(ctx.token, object_name, function(
            jqXHR) {
            if(jqXHR.status == 204) {
                var id = jqXHR.getResponseHeader("upload-id");
                var data = "Hello World! (partially)";
                ctx.fsio.data.uploadPartially(ctx.token, id, data, 10, function(
                    jqXHR) {
                    $("body").append("<br><br>Uploaded partially '" + object_name + "': "+
                                     jqXHR.status);
                    if(jqXHR.status == 204) {
                        waitUntilScanned(ctx, object_name);
                    } else {
                        $("body").append("<br>Failed to upload partially: " +
                                         jqXHR.status);
                    }
                });
            } else {
                $("body").append("<br>Failed to init partial upload: " +
                                 jqXHR.status);
            }
        });
    }

    function uploadFile(ctx) {
        var object_name = randomString() + "_" + new Date().getTime();
        var data = "Hello World!";
        ctx.fsio.data.upload(ctx.token, object_name, data, function(jqXHR) {
            $("body").append("<br><br>Uploaded '" + object_name + "': "+
                             jqXHR.status);
            if(jqXHR.status == 204) {
                waitUntilScanned(ctx, object_name);
            } else {
                $("body").append("<br>Failed to upload: " + jqXHR.status);
            }
        });
    }

    function uploadBuffer(ctx, object_name, arrayBuffer, ctype) {
        // Create a blob from the arraybuffer data.
        var blob = new Blob([arrayBuffer]);
        // Upload the blob.
        ctx.fsio.data.upload(ctx.token, object_name, blob, function(jqXHR) {
            $("body").append("<br><br>Uploaded '" + object_name + "': " +
                             jqXHR.status);
        }, {}, {"content-type": ctype ? ctype : ""});
    }

    function createUploadToken(ctx) {
        ctx.fsio.ticket.createUploadToken(ctx.ticket, function(jqXHR) {
            if(jqXHR.status == 200) {
                ctx.token = JSON.parse(jqXHR.responseText).Token;
                uploadFile(ctx);
                uploadFilePartially(ctx);
            } else {
                $("body").append("<br>Failed to create upload token: " +
                                 jqXHR.status);
            }
        });
    }

    $(function() {
        var can = null;
        var ctx = {};

        // Form for uploading file.
        var form = document.getElementById("upload_form");
        // Add event handler for upload form.
        form.addEventListener("change", function(evt) {
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function() {
                console.log("Uploading: " + file.name);
                uploadBuffer(ctx, file.name, this.result,
                             file.type);
            };
            reader.readAsArrayBuffer(file);
        }, false);

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
                ctx.fsio = can.createFsioClient();
            } catch(err) {
                $("body").append("<br>" + err.name + ": " + err.message);
                return;
            }
            // Create FSIO ticket.
            can.createFsioUserTicket(ctx.fsio, function(status, ticket) {
                if(status == 200) {
                    ctx.ticket = ticket;
                    // Get user account info.
                    getFsioUserAccountInfo(ctx);
                    // Create upload token.
                    createUploadToken(ctx);
                } else {
                    $("body").append("<br>Failed to create FSIO ticket: " +
                                     status);
                }
            });
        });
    });

});
