/*
 This file is part of Tux Racing.

 Tux Racing is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Tux Racing is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Tux Racing. If not, see <http://www.gnu.org/licenses/>.
 */
define([
    "tpl!./tpl/tpl_exercise.html",
    "i18n!./nls/i18n_exercise",
    "router",
    "TR",
    "utilities",
    "app/pages/error/error",
    "assetManager",
    "timer",
    "./lesson",
    "./scene",
    "./ship",
    "jquery"
], function (gameView, text, router, TR, utilities, error, assetManager,
             timerModule, lesson, Scene, Ship) {
    // Flag to stop all intervals, cleared on exit and reset on entry
    var stopUpdating = false;

    // Set up and manage game logic/UI
    // A simple "engine" based around DOM entities until the canvas engine is complete
    function playGame(exercise, module, exerciseId) {
        // Lookup key for the key-value store for the star count of this particular exercise
        var exerciseStarKey = "tr.module." + module.ref() + ".exercise." + exerciseId;

        // Preload the green and blue-ish spaceships for the NPC/player (respectively)
        assetManager.download({
            gspaceship: "img/greenship.png",
            bspaceship: "img/blueship.png"
        }, function (loadSuccess) {
            // Implements the scrolling background by regularly updating
            // the css background position. Currently does not account
            // for window resize, this may be desired so the speed is
            // identical after orientation change
            var background = (function () {
                    // Speed is the number of times we scroll the window width per second
                    var speed = 0,
                        bg = $("body"),
                        // bgWidth is hard coded to the width of the background image
                        bgWidth = 600,
                        scrolledPixels = 0,
                        converter = utilities.pixelConverter(bg.get(0)),
                        // TODO tie this into window resize? Maybe best not to, so speed remains the same after rotation
                        windowWidth = converter(bg.css("width"));

                    return {
                        /**
                         * Set the background scroll rate, with newSpeed
                         * representing the number of times we scroll the width
                         * of the window per second.
                         * @param newSpeed
                         */
                        setSpeed: function (newSpeed) {
                            speed = newSpeed;
                        },
                        /**
                         * Step the background scroll by ds seconds
                         * @param ds
                         */
                        step: function (ds) {
                            // Display glitches appeared on a test 2.2.x
                            // Android device when background wasn't wrapped
                            scrolledPixels = (scrolledPixels -
                                              ds * speed * windowWidth | 0) % bgWidth;
                        },
                        /**
                         * Update the DOM entities' displayed background scroll
                         */
                        render: function () {
                            bg.css("background-position", scrolledPixels + "px 0px");
                        }
                    };
                })(),
                scene = new Scene($("#TRSpace")),
                ships = [],
                NPC, playerShip, targetRates;

            //------
            // Position ships in three intervals
            //------
            // Divide the playing space into three intervals. Set the middle
            // interval as the human's ship (bspaceship) and all other ships
            // as the NPC green ship
            for (var i = 0; i < 3; i++) {
                NPC = new Ship(scene, i === 1 ? assetManager.cache.bspaceship : assetManager.cache.gspaceship);
                NPC.pos = [
                    // Place the middle of the ship roughly in the middle of the interval (off by half the ship height/width)
                    50,
                    30 * (i + 1 / 2)
                ];

                ships.push(NPC);
            }
            playerShip = ships[1];

            //------
            // Set NPC exercise race constants
            //------
            // Randomly set target rates for the NPC ships. there are always two
            // target rates returned by the exercise.
            targetRates = exercise.targetRates();

            // Randomly set the first ship to the first or second target rate
            if (Math.random () > 0.5) {
                ships[0].vel[0] = ships[0].targetRate = targetRates.pop();
            } else {
                ships[0].vel[0] = ships[0].targetRate = targetRates.shift();
            }
            // Set the second ship to the remaining target rate
            ships[2].vel[0] = ships[2].targetRate = targetRates.pop();

            //------
            // Handle the question/answer graphics
            //------
            // Set up answer handler. On correct answers, the answer is
            // highlighted in green and displayed for 500ms. On incorrect, the
            // correct and selected incorrect answer are highlighted in green
            // and red, respectively, and displayed for 1 second. Note that this
            // means randomly guessing answers gives a lesson.rate of 17.14 with
            // 4 choices/questino
            // r = 1 / ((p_correct * 500 + p_incorrect * 1000) / 60000) * p_correct
            lesson.onCorrect(function (data) {
                if (!stopUpdating) {
                    var correctTimeout = 500,
                        incorrectTimeout = 1000,
                        timeout = correctTimeout;
                    // Hide all choices
                    lesson.elem.find("li").each(function () {
                        $(this).addClass("invisible");
                    });

                    // If the answer is incorrect, extend timeout and un-hide/highlight incorrect answer
                    if (!data.isCorrect) {
                        timeout = incorrectTimeout;
                        data.elem.removeClass("invisible");
                        data.link.addClass("incorrect");
                        data.link.replaceWith(data.link.clone());
                    }

                    // Un-hide and highlight correct answer
                    lesson.correctElem.removeClass("invisible");
                    lesson.correctElem.children("a").addClass("correct");
                    lesson.correctElem.replaceWith(lesson.correctElem.clone());

                    // Load a new question after the player has had time to see the correct answer
                    window.setTimeout(function () {
                        lesson.newProblem();
                    }, timeout);
                }
            });

            // Reset the lesson with the exercise
            lesson.start(exercise.generate.bind(exercise));
            //------
            // Timer
            //------
            // Limits the game play to a length specified by the exercise
            // Updates the timer bar every ~100ms and handles exiting the
            // game to the results screen when time runs out.
            var timer = (function () {
                var start = +new Date(),
                    duration = exercise.duration() * 1000;

                function progress(time) {
                    $("#timeBar").css("width", (1 - (time - start) / duration) * 100 + "%");
                }

                function finish() {
                    // Sort a copy of the ships array by their position at the end
                    var finishPosition = ships.slice(0).sort(function (a, b) {
                            return b.pos[0] - a.pos[0];
                        }),
                    // Stars = finishing position
                        stars = 3 - finishPosition.indexOf(playerShip);

                    // Turn the sorted ship array into strings for the URI
                    finishPosition.forEach(function (val, idx, arr) {
                        if (val === ships[0]) {
                            val = "ship1";
                        } else if (val === ships[1]) {
                            val = "player";
                        } else if (val === ships[2]) {
                            val = "ship2";
                        } else {
                            val = "unknown";
                        }
                        arr[idx] = encodeURIComponent(val);
                    });

                    // Update the stars store for this exercise if the player scored
                    // higher than the previous value
                    if (stars > utilities.store.getItem(exerciseStarKey, 0)) {
                        utilities.store.setItem(exerciseStarKey, stars);
                    }

                    // Stop the game main loop from continuing
                    stopUpdating = true;

                    // Change to the results page
                    router.go("results/" + encodeURIComponent(module.ref()) + "/" +
                        finishPosition.join("/"));
                }

                return {
                    tick: function ()  {
                        var t2 = +new Date();
                        if (t2 < start + duration) {
                            progress(t2);
                        } else {
                            finish();
                        }
                    }
                };
            })();

            //------
            // Game main loop
            //------
            // Uses requestAnimationFrame to aim for 60fps. utilities uses a
            // polyfill to support. Every update it steps ships within their
            // horizontal constraints as well as updating the background
            var t1 = +new Date();
            var maxRate = exercise.maximumRate();
            (function update() {
                if (!stopUpdating) {
                    var t2 = +new Date(),
                        dt = t2 - t1,
                        ds = dt / 1000,
                        playerRate = lesson.rate(),
                        ship, i;

                    timer.tick();


                    //------
                    // Energy bar
                    //------
                    // Energy bar displays the player's rate as a percent of "maximum" rate
                    // Maximum rate is just a point slightly over 1st place
                    $("#energyBar").css("width", Math.min(1, lesson.rate() / maxRate) * 100 + "%");

                    // updated the background speed based on player's rate
                    background.setSpeed(playerRate / exercise.maximumRate() /3 + 1/4);
                    // Step ds seconds and adjust the background scroll
                    background.step(ds);
                    background.render();

                    // Move all ships relative to the player ship by subtracting
                    // velocity from the player velocity
                    playerShip.targetRate = playerRate;
                    for (i = 0; i < ships.length; i++) {
                        ship = ships[i];
                        ship.vel[0] = ship.targetRate - playerRate;

                        // NPCs are strongly capped in the rage 0..80%, with some
                        // random velocity that should average to 0 but still
                        // provide some small movements at the end points.
                        if (ship !== playerShip) {
                            if (ship.pos[0] >= 80 && ship.vel[0] > 0) {
                                ship.vel[0] = 0;
                            } else if (ship.pos[0] <= 20 && ship.vel[0] < 0) {
                                ship.vel[0] = 0;
                            }
                            ship.vel[0] += (2 * Math.random() - 1) * 5;
                        }

                        ship.step(ds);
                        ships[i].render();
                    }

                    t1 = t2;

                    requestAnimationFrame(update);
                }
            })();
        });
    }

    // Setup the game by resetting the flag, setting the page HTML and loading
    // the exercise module
    function setup(module, exerciseId) {
        utilities.display("", "");
        utilities.display("exercise", gameView());
        stopUpdating = false;
        module.exercise(exerciseId, function (exercise) {
            playGame(exercise, module, exerciseId);
        });
    }

    var moduleListener;
    // TODO error handling of arguments (not a problem for packaged app)
    router.map("exercise/{shortName}/{exerciseId}").enter(function (args) {
        // Setup a listener so we can catch the module when it gets loaded
        moduleListener = function (shortName, module) {
            if (shortName === args.shortName) {
                setup(module, args.exerciseId);
            }
        }
        TR.moduleLoaded.add(moduleListener);
    }).to(function (args) {
        // If the module is already loaded, ship to setup
        var module = TR.practiceModule(args.shortName);
        if (module) {
            setup(module, args.exerciseId);
        }
    }).exit(function () {
        // Unload the module listener and prevent the game main loop from continuing
        stopUpdating = true;
        TR.moduleLoaded.remove(moduleListener);
    });
});
