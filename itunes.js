var spawn = require("child_process").spawn;

module.exports.tracks_of_playlists = function tracks_of_playlists(playlists, callback) {
	var osascript = spawn("osascript",
	                      [__dirname + "/" + "helper_get_tracks_of_playlist.applescript"].concat(playlists),
	      				  {env: process.env});
	var stdout = "";
	osascript.stdout.on("data", function (chunk) {
		stdout += chunk;
	});
	osascript.on("exit", function (code) {
		if (code == 0) {
			callback(null, JSON.parse(stdout));
		} else {
			callback("osascript exited with code" + code, null);
		}
	});
};
