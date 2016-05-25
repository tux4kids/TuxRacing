var child = require("child_process"),
    rjs = require("requirejs"),
    fs = require("fs"),
    path = require("path"),
    lessonSourceDir = "lessons",
    lessonDestDir = "./build/lessons/",
    mainDest = "./build/",
    masterDest = "./src/master.json",
    YAML = require('libyaml'),
    lessonParser = function (lessonStr) {
        var lessonOpts = {},
            i,
            line;
        lessonStr = lessonStr.split("\n");

        for(i = 0; i < lessonStr.length; i++) {
            line = lessonStr[i].trim();
            if (line && line.charAt(0) != "#" && line.charAt(0) != ";") {
                line = line.split("=");
                lessonOpts[line[0].trim()] = Number(line[1].trim());
            }
        }
        return lessonOpts;
    };

namespace("tests", function () {
    desc("Run jsTestDriver tests (assumes the server is started and has captured browsers)");
    task("jstd", function () {
        console.log("Running all tests (ensure the test server is started and has captured browsers)");
        var cmd = "java -jar vendor/JsTestDriver.jar --config vendor/jsTestDriver.conf --tests all";

        child.exec(cmd, function (error, stdout, stderr) {
            console.log(stdout);
            if (stderr) {
                console.log("stderr: " + stderr);
            }
            if (error) {
                console.log("exec error: " + error);
            }
        });
    });
});

namespace("build", function () {
    desc("Builds the lesson master");
    task("lessonmaster", function () {
        // Asynchronously read the lesson directory contents
        fs.readdir(lessonSourceDir, function (err, files) {
            if (err) {
                throw err;
            }
            var remainingFiles = files.length,
                lessonMaster = [],
                i;

            // Process all files in directory
            for (i = 0; i < files.length; i++) {
                (function (directory, filename) {
                    var sourcePath = path.join(directory, filename),
                        destPath = path.join(lessonDestDir, filename.replace(/\.yaml$/,".json"));

                    // Asynchronously read the lesson file
                    if (path.extname(sourcePath) === '.yaml') {
                        YAML.readFile(sourcePath, function (err, lessonObj) {
                            if (err) {
                                throw err;
                            }
                            lessonObj = lessonObj[0];
                            // Push the lesson file onto the lesson master
                            lessonMaster.push({
                                title: lessonObj.info.title,
                                path: "lessons/" + filename.replace(/\.yaml$/,".json"),
                                id: lessonObj.info.id,
                                rank: lessonObj.info.rank
                            });

                            // Write the JSON lesson file
                            fs.writeFile(destPath, JSON.stringify(lessonObj), "utf8", function (err) {
                                if (err) {
                                    throw err;
                                }

                                // Write master JSON and halt when no files remain
                                --remainingFiles;
                                if (!remainingFiles) {
                                    // Sort lesson master before writing
                                    lessonMaster.sort(function (a, b) {
                                        if (a.rank > b.rank) {
                                            return 1;
                                        } else if (a.rank < b.rank) {
                                            return -1;
                                        } else {
                                            return 0;
                                        }
                                    });

                                    // Asynchronously write the JSON form of the lesson master
                                    fs.writeFile(masterDest, JSON.stringify(lessonMaster), "utf8", function (err) {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log("Successfully build and wrote " + masterDest);
                                        complete();
                                    });
                                }
                            });
                        });
                    } else {
                        --remainingFiles;
                    }
                // Create a local copy of the file path
                })(lessonSourceDir, files[i]);
            }
        })
    }, true);

    desc("Builds the minified stand-alone version of the arithmetic module");
    task("rjs", function () {
        // Setting for "published" modules
        var productionConfig = {
            baseUrl: "./src",
            name: "almond",
            out: mainDest + "main.js",
            include: "main",
            paths: {
                text: "../vendor/requirejs-plugins/text",
                json: "../vendor/requirejs-plugins/json",
                i18n: "../vendor/requirejs-plugins/i18n",
                almond: "../vendor/almond"
            },
            inlinei18n: true,
            wrap: true,
            insertRequire: ["main"],
            preserveLicenseComments: false
        };

        rjs.optimize(productionConfig, function (response) {
            console.log(response);
            
            var source = fs.createReadStream("res/chemistry.png");
            var dest = fs.createWriteStream(mainDest + "icon.png");
            
            source.on("end", function () {
                console.log("Done building production library, final file is " + productionConfig.out);
            });
            
            source.pipe(dest);
        });

    }, true);

    desc("Run all build tasks");
    task("all", ["build:lessonmaster", "build:rjs"], function () {
        console.log("Built practices and main library");
    });
});
