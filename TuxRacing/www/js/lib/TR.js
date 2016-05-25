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
define(['signals'], function(signals) {
    var that = {},
    // 1 second wait for XMLHttpRequests. Plenty for app requests
        REQUEST_TIMEOUT = 1000,
    // Default modules to load, name = folder in the default folder
        defaultModules = ["barith"],
    // Cache module objects here
        loadedModules = {},
        activeLocale = "root";

    // Dynamically inject a new script.
    function loadScript(url) {
        var head = document.getElementsByTagName("head")[0],
            script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        head.appendChild(script);
    }

    /**
     * Attempts to detect active locale after being passed the navigator object.
     * Includes fix for android browsers, which always set nav.language = en
     * Returns "root" when no locale is found, which indicates "use whatever
     * is the default translation string". Usually en.
     *
     * @param navigator
     * @return {String}
     */
    that.getLocale = function () {
        var defaultLocale = 'root',
            locale;

        // No navigator to detect locale with, use root
        if (typeof window.navigator === 'undefined') {
            locale = defaultLocale;

        // Special case for Android browser; navigator.language is always en
        } else if (navigator.userAgent && navigator.userAgent.match(/Android/)) {
            locale = navigator.userAgent.match(/Android \d+(?:\.\d+){1,2}; ([a-z]{2}-[a-z]{2})/);
            if (locale) {
                locale = locale[1];
            }

        } else if (navigator.language) {
            locale = navigator.language;

        } else if (navigator.userLanguage) {
            locale = navigator.userLanguage;

        } else if (navigator.systemLanguage) {
            locale = navigator.systemLanguage;

        }
        return (locale || defaultLocale).toLowerCase();
    };

    // Loads default modules, and tries to load all custom modules
    // Pass in base so TR knows where the default module directory is
    that.init = function (base) {
        var i;
        // Asynchronously load the default modules
        for (i = 0;i < defaultModules.length; i++) {
            loadScript(base + defaultModules[i] + "/main.js");
        }
    };

    // scanLoad is for loading apps in the phonegap app.
    that.scanLoad = function () {
        // PhoneGap-only
        if (window.requestFileSystem && window.LocalFileSystem) {
            // Try to get the root FS of the modules directory
            // Quietly fails if it doesn't exist
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                fs.root.getDirectory("tr.modules", {create: true}, function (moduleDir) {
                    var moduleReader = moduleDir.createReader();

                    moduleReader.readEntries(function (entries) {
                        var i, entry;
                        for (i = 0; i < entries.length; i++) {
                            entry = entries[i];
                            if (entry.isFile) {
                                loadScript(entry.toURL());
                            }
                        }
                    });
                });

            }, null);
        }
    };

    // Get a locally available JSON file.
    that.getJSON = function (url, success, error) {
        var req = new XMLHttpRequest(),
            timeoutTimer;
        // Phonegap doesn't work usually without stripping out the prefix to
        // create relative URLs
        url = url.replace(/^file:\/\/\/android_asset\/www\//, '');

        req.open("GET", url, true);
        req.onreadystatechange = function () {
            var response;
            if (req.readyState == 4) {
                // status === 0 is for fs requests in PG (sometimes)
                if (req.status == 200 || req.status == 0 ) {
                    window.clearTimeout(timeoutTimer);
                    response = JSON.parse(req.responseText);
                    success(response);
                } else if (error) {
                    error("REQUEST_ERROR");
                }
            }
        };

        // Watch for timed out requests.
        timeoutTimer = window.setTimeout(function () {
            req.abort();
            if (error) {
                error("TIMEOUT");
            }
        }, REQUEST_TIMEOUT);
        req.send();
    };

    //that.getJSON("defaultModules/barith/practices/lesson01.json");
    // modules are stored in folders named after their refName
    // This function returns the module path.
    // ONLY works on *loaded* modules
    that.modulePath = function (shortName) {
        var scripts = document.getElementsByTagName("script"),
            script, src, path, plength, i;

        // Scan for a script tag where the file name is main.js and that file's parent folder matches the module shortName
        for (i = 0; i < scripts.length; i++) {
            script = scripts[i];
            src = script.src;

            path = src.split('?')[0]; // Remove the query portion of the source path
            path = path.split('/');
            plength = path.length - 1;

            if (path[plength] === 'main.js' && path[plength - 1] === shortName) {
                path.pop(); // Remove the entry-point filename
                return path.join("/") + "/";
            }
        }
    };

    // Make signalling publicly available without requiring signals
    that.newSignal = function () {
        return new signals.Signal();
    };

    // Signal for newly loaded modules
    that.moduleLoaded = new signals.Signal();

    // Check support for the expected module interface so we can log failed
    // modules instead of crashing silently. If the newly loaded module passes,
    // cache the object in loadedModules.
    that.moduleLoaded.add(function (shortName, module) {
        var isFunction = function (f) {
            // Make sure casting to string yields the appropriate value
            return Object.prototype.toString.call(f) === '[object Function]';
        }
        // Check standard method existence before saving it
        if (isFunction(module.name) && isFunction(module.ref) && isFunction(module.iconPath) &&
            isFunction(module.description) && isFunction(module.supportsLocale) &&
            isFunction(module.exercises) && isFunction(module.exercise)) {

            loadedModules[shortName] = module;
        } else {
            console.error('Module ' + shortName + ' is missing a standard interface, not loaded');
            return false;
        }
    });

    // Returns an array of module objects
    that.practiceModules = function () {
        var modules = [],
            shortName;

        for (shortName in loadedModules) {
            if (loadedModules.hasOwnProperty(shortName)) {
                modules.push(loadedModules[shortName]);
            }
        }
        return modules;
    };

    /**
     * Get a loaded module from the loadedModule cache. Or undefined if the
     * module isn't loaded yet.
     *
     * @param shortName
     * @return {*}
     */
    that.practiceModule = function (shortName) {
        return loadedModules[shortName];
    };

    // Pollute global but also allow importing through a specific variable
    window.TR = that;
    return that;
});
