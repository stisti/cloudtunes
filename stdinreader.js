var fs = require("fs");
var async = require("async");
var carrier = require("carrier");
var c = carrier.carry(process.stdin);

var num_files = 0;
var q = async.queue(function (task, callback) {
        console.log("Working on", task.musicfile);
        var devnull = fs.createWriteStream("/dev/null");
        devnull.on("close", function () {
            callback();
        });
        fs.createReadStream(task.musicfile).pipe(devnull);
}, 2);

q.drain = function () {
    console.log("All", num_files, "processed.");
}

c.on('line', function (musicfile) {
    console.log("Queuing", musicfile);
    q.push({musicfile: musicfile}, function (err) {
        num_files++;
    });
});
c.on('end', function () {
    console.log("Input drained.");
});

process.stdin.setEncoding('utf8');
process.stdin.resume();
