var child = require("child_process"),
    rjs = require("requirejs"),
    fs = require("fs"),
    path = require("path"),
    YAML = require('libyaml'),
    yamlOutput = "exercises",
    tuxmathSource = "practices",
    lessonDestDir = "./build/practices/",
    mainDest = "./build/",
    masterDest = "./src/master.json",
    lessonParser = function (lessonStr) {
        var lessonOpts = {},
            i,
            line;
        lessonStr = lessonStr.split("\n");

        for(i = 0; i < lessonStr.length; i++) {
            line = lessonStr[i].trim();
            if (line && line.charAt(0) != "#" && line.charAt(0) != ";") {
                line = line.split("=");
                line[1] = line[1].split("#")[0];
                lessonOpts[line[0].trim()] = Number(line[1].trim());
            }
        }
        return lessonOpts;
    };

namespace("tests", function () {
    desc("Run jsTestDriver tests (assumes the server is started and has captured browsers)");
    task("jstd", function () {
        console.log("Running all tests (ensure the test server is started and has captured browsers)");
        var cmd = "java -jar vendor/jsTestDriver/JsTestDriver.jar --config vendor/jsTestDriver/jsTestDriver.conf --tests all";

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

namespace("converter", function () {
    desc("Creates the directory for yaml files");
    directory(yamlOutput);

    desc("Converts TuxMath lesson files to arithmetic module yaml files");
    task("toyaml", ["converter:exercises"], function () {
        function validateSettings(settings) {
            var operationsMap = {
                    addition_allowed: ["augend", "addend"],
                    division_allowed: ["quotient", "divisor"],
                    multiplication_allowed: ["multiplier", "multiplicand"],
                    subtraction_allowed: ["subtrahend", "minuend"]
                },
                formatAnswerTypes = ["first", "middle", "last"],
                allowedCount = 0,
                key, i, dependency;

            for (key in operationsMap) {
                if (operationsMap.hasOwnProperty(key) && settings[key]) {
                    allowedCount++;

                    for (i = 0; i < operationsMap[key].length; i++) {
                        dependency = operationsMap[key];
                        if (!isNaN(settings["min_" + dependency]) ||
                            !isNaN(settings["max_" + dependency])) {
                            return "Enabled operation " + key +
                                " but dependency setting " + dependency +
                                " is missing";
                        }
                    }
                }
            }
            if (!allowedCount) {
                return "No operations allowed"
            }

            allowedCount = 0;
            for (i = 0; i < formatAnswerTypes.length; i++) {
                if (settings["format_answer_" + formatAnswerTypes[i]]) {
                    allowedCount++;
                }
            }
            if (!allowedCount) {
                return "No answer formats enabled";
            }

            if (!settings.firstPlace || !settings.secondPlace ||
                !settings.maxRate || !settings.duration) {
                return "Missing race constants";
            }
        }
        function processFile(contents) {
            var settings = lessonParser(contents),
                strippedSettings = {
                    addition_allowed: !!settings.addition_allowed,
                    subtraction_allowed: !!settings.subtraction_allowed,
                    multiplication_allowed: !!settings.multiplication_allowed,
                    division_allowed: !!settings.division_allowed,
                    min_augend: +settings.min_augend,
                    max_augend: +settings.max_augend,
                    min_addend: +settings.min_addend,
                    max_addend: +settings.max_addend,
                    min_multiplier: +settings.min_multiplier,
                    max_multiplier: +settings.max_multiplier,
                    min_multiplicand: +settings.min_multiplicand,
                    max_multiplicand: +settings.max_multiplicand,
                    min_minuend: +settings.min_minuend,
                    max_minuend: +settings.max_minuend,
                    min_subtrahend: +settings.min_subtrahend,
                    max_subtrahend: +settings.max_subtrahend,
                    min_divisor: +settings.min_divisor,
                    max_divisor: +settings.max_divisor,
                    min_quotient: +settings.min_quotient,
                    max_quotient: +settings.max_quotient,
                    format_answer_last: !!settings.format_answer_last,
                    format_answer_middle: !!settings.format_answer_middle,
                    format_answer_first: !!settings.format_answer_first,
                    allow_negatives: !!settings.allow_negatives,
                    max_answer: +settings.max_answer,
                    firstPlace: +settings.firstPlace,
                    secondPlace: +settings.secondPlace,
                    maxRate: +settings.maxRate,
                    duration: +settings.duration
                },
                error = validateSettings(strippedSettings);

            if (error) {
                fail("Error: " + error);
            }
            return strippedSettings;
        }

        // Asynchronously read the lesson directory contents
        fs.readdir(tuxmathSource, function (err, files) {
            if (err) {
                throw err;
            }
            var remainingFiles = files.length,
                titleMatcher = /^#(.*?)$/m,
                sortMatcher = /(\d+)$$/m,
                i;

            // Process all files in directory
            for (i = 0; i < files.length; i++) {
                (function (directory, filename) {
                    var sourcePath = path.join(directory, filename);

                    // Asynchronously read the lesson file
                    fs.readFile(sourcePath, "utf8", function (err, data) {
                        console.log("Processing " + sourcePath);
                        if (err) {
                            fail(err);
                        }

                        var settings = processFile(data),
                            lessonObj = {
                                settings: settings,
                                title: titleMatcher.exec(data)[1].trim(),
                                id: +sortMatcher.exec(filename)[1]
                            };
                        // Asynchronously write the JSON form of the lesson master
                        YAML.writeFile(
                            path.join(yamlOutput, filename + ".yaml"),
                            lessonObj,
                            "utf8",
                            function (err) {
                                if (err) {
                                    fail(err);
                                } else {
                                    --remainingFiles;
                                    if (!remainingFiles) {
                                        console.log("Successfully build and wrote all lessons");
                                        complete();
                                    }
                                }
                            }
                        );
                    });
                    // Create a local copy of the file path
                })(tuxmathSource, files[i]);
            }
        })
    }, true);
});

namespace("build", function () {
    desc("Creates the final lesson output folder");
    directory(lessonDestDir);

    desc("Builds the lesson files");
    task("lessons", [lessonDestDir], function () {
        // Asynchronously read the lesson directory contents
        fs.readdir(yamlOutput, function (err, files) {
            if (err) {
                fail(err);
            }
            var remainingFiles = files.length,
                i;

            // Process all files in directory
            for (i = 0; i < files.length; i++) {
                (function (directory, filename) {
                    var sourcePath = path.join(directory, filename);

                    // Asynchronously read the lesson file
                    YAML.readFile(sourcePath, "utf8", function (err, lesson) {
                        if (err) {
                            fail(err);
                        }
                        lesson = lesson[0];

                        // Asynchronously write the JSON form of the lesson master
                        fs.writeFile(
                            path.join(lessonDestDir, filename.substr(0, filename.length - 5) + ".json"),
                            JSON.stringify(lesson),
                            "utf8",
                            function (err) {
                                if (err) {
                                    fail(err);
                                }
                                // Write master JSON and halt when no files remain
                                --remainingFiles;
                                if (!remainingFiles) {
                                    console.log("Successfully build and wrote all lessons");
                                    complete();
                                }
                            }
                        );
                    });
                    // Create a local copy of the file path
                })(yamlOutput, files[i]);
            }
        })
    }, true);

    desc("Builds the lesson master file");
    task("lessonmaster", function () {
        // Asynchronously read the lesson directory contents
        fs.readdir(lessonDestDir, function (err, files) {
            if (err) {
                fail(err);
            }
            var remainingFiles = files.length,
                lessonMaster = [],
                i;

            // Process all files in directory
            for (i = 0; i < files.length; i++) {
                (function (directory, filename) {
                    var sourcePath = path.join(directory, filename);

                    // Asynchronously read the lesson file
                    fs.readFile(sourcePath, "utf8", function (err, data) {
                        if (err) {
                            throw err;
                        }
                        var lessonObj = JSON.parse(data);

                        // Push the lesson file onto the lesson master
                        lessonMaster.push({
                            title: lessonObj.title,
                            file: filename,
                            id: lessonObj.id,
                            sort: +(lessonObj.id)
                        });

                        // Write master JSON and halt when no files remain
                        --remainingFiles;
                        if (!remainingFiles) {
                            // Sort lesson master before writing
                            lessonMaster.sort(function (a, b) {
                                if (a.sort > b.sort) {
                                    return 1;
                                } else if (a.sort < b.sort) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });

                            // Asynchronously write the JSON form of the lesson master
                            fs.writeFile(masterDest, JSON.stringify(lessonMaster), "utf8", function (err) {
                                if (err) {
                                    fail(err);
                                }
                                console.log("Successfully build and wrote " + masterDest);
                                complete();
                            });
                        }
                    });
                    // Create a local copy of the file path
                })(lessonDestDir, files[i]);
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
                inlineText: true,
                inlinei18n: true,
                wrap: true,
                insertRequire: ["main"],
                preserveLicenseComments: false
            };

        rjs.optimize(productionConfig, function (response) {
            console.log(response);
            
            var source = fs.createReadStream("res/arithmetic.png");
            var dest = fs.createWriteStream(mainDest + "icon.png");
            
            source.on("end", function () {
                console.log("Done building production library, final file is " + productionConfig.out);
            });
            
            source.pipe(dest);
        });

    }, true);

    desc("Run all build tasks");
    task("all", ["build:lessons", "build:lessonmaster", "build:rjs"], function () {
        console.log("Built practices and main library");
    });
});
