const fs = require('fs');

// recursively walk a dir, get files
module.exports = function walk(dir, done) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;

        (function next() {
            var file = list[i++];

            if (!file) return done(null, results);

            file = dir + '/' + file;

            fs.stat(file, function(err, stat) {
                if (stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                }
                else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};


// fs.stat(dir, function(err, stat) {
//     console.log(stat.isDirectory());

//     if (stat.isDirectory() === false) {
//         isDirectory = false;
//     }
// });

// // if single file passed in
// if (isDirectory === false) {
//     fs.readFile(dir, function(err, file) {
//         if (err) return done(err);
//         return done(null, file);
//     });
// }
// else {