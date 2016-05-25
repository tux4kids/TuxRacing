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
define(function () {
    var module = {},
        assets = {},
        muted = false,
        MUTED_ID = 2,
        LOAD_TIMEOUT = 1000; // 1 second timeout

    if (window.PGLowLatencyAudio) {
        module.load = function (id, path, win, fail) {
            if (assets[id]) {
                window.setTimeout(win, 0);
            } else {
                PGLowLatencyAudio.preloadAudio(id, path, 1, function () {
                    assets[id] = true;
                    win();
                }, fail);
            }
        };

        module.loop = function (id, win, fail) {
            if (!muted) {
                PGLowLatencyAudio.loop(id, win, fail);
            } else {
                setTimeout(win, 0);
            }
        };

        module.stop = function (id, win, fail) {
            PGLowLatencyAudio.stop(id, win, fail);
        };

        module.play = function (id, win, fail) {
            if (!muted) {
                PGLowLatencyAudio.play(id, win, fail);
            } else {
                setTimeout(win, 0);
            }
        };
    } else {
        var loopListener = function () {
            this.currentTime = 0;
            this.play();
        };

        module.load = function (id, path, win, fail) {
            var audioElem, sourceElem, timeoutListener;

            if (assets[id]) {
                window.setTimeout(function () {
                    win();
                }, 0);
            } else {
                audioElem = document.createElement("audio");
                audioElem.setAttribute("id", id);
                audioElem.setAttribute("preload", "audio");

                window.setTimeout(function () {
                    fail("timeout");
                }, LOAD_TIMEOUT);

                audioElem.addEventListener("canplaythrough", function () {
                    assets[id] = true;
                    win();
                    window.clearTimeout(timeoutListener);
                }, true);

                audioElem.addEventListener("error", function () {
                    fail("error");
                    window.clearTimeout(timeoutListener);
                }, true);


                sourceElem = document.createElement("source");
                sourceElem.setAttribute("src", path);

                audioElem.appendChild(sourceElem);
                document.body.appendChild(audioElem);
            }
        };

        module.loop = function (id, win, fail) {
            var audioElem;

            if (assets[id]) {
                if (!muted) {
                    // Clear existing loop listeners, then add one to loop the track on end
                    audioElem = document.getElementById(id);
                    audioElem.removeEventListener("ended", loopListener);
                    audioElem.addEventListener("ended", loopListener);
                    audioElem.play();
                }

                win();
            } else {
                fail();
            }
        };

        module.stop = function (id, win, fail) {
            var audioElem;

            if (assets[id]) {
                audioElem = document.getElementById(id);
                audioElem.pause();
                audioElem.currentTime = 0;
                win();
            } else {
                fail();
            }
        };

        module.pause = function (id, win, fail) {
            var audioElem;

            if (assets[id]) {
                audioElem = document.getElementById(id);
                audioElem.pause();
                win();
            } else {
                fail();
            }
        };

        module.play = function (id, win, fail) {
            var audioElem;

            if (assets[id]) {
                if (!muted) {
                    audioElem = document.getElementById(id);
                    audioElem.play();
                }
                win();
            } else {
                fail();
            }
        }
    }

    module.mute = function (win, fail) {
        var k, m = 0, i = 0;
        for (k in assets) {
            if (assets.hasOwnProperty(k)) {
                i++;
                m++;
                module.pause(k, function () {
                    i--;
                    if (i === 0) {
                        assets[id] = MUTED_ID;
                        muted = true;
                        win();
                    }
                }, fail);
            }
        }
        if (!m) {
            win();
        }
    };

    module.muted = function () {
        return muted;
    }

    module.unmute = function (win, fail) {
        var k, m = 0, i = 0;
        for (k in assets) {
            if (assets.hasOwnProperty(k) && assets[k] === MUTED_ID) {
                i++;
                m++;
                module.play(k, function () {
                    i--;
                    if (i === 0) {
                        assets[id] = 1;
                        muted = false;
                        win();
                    }
                }, fail);
            }
        }
        if (!m) {
            win();
        }
    };

    return module;
});