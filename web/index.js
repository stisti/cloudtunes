requirejs.config({
    baseUrl: 'js'
});

requirejs(["jquery", "FipCanConfig.js", "Dev.js", "Can"], function(
    $, CONFIG, DEV, Can) {

    // Create CAN SDK instance.
    var can = new Can(CONFIG, DEV.api_key, DEV.api_key_secret);
    // Get login url with redirect to our login page.
    var post_auth_url = encodeURIComponent("http://127.0.0.1:8124/login.html");
    can.getLoginUrl(post_auth_url, function(status, url) {
        if(status == 200) {
            window.location.replace(decodeURIComponent(url));
        } else {
            $("body").append("Failed to get login url: " + status);
        }
    });

});
