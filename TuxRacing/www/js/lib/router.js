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
// Simple aspect-oriented wrapper to crossroads + hasher
// Inspired by Path.js
define(['hasher', 'crossroads'], function (hasher, crossroads) {
    var router = {};

    // Setup the router with a default URL
    router.init = function (DEFAULT_HASH) {
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;

        function parseHash(newHash, oldHash) {
            crossroads.parse(newHash);
        }

        // Initialize hasher and hook it up with crossroads
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();

        // If page is loaded without a hash, load the default
        if (!hasher.getHash()) {
            hasher.setHash(DEFAULT_HASH);
        }
    };

    // provide support for router.map(url).enter(func).to(func).exit(func)
    // To is called after load, enter is before and exit is upon unloading.
    router.map = function (hash) {
        var routeObj = {},
            route = crossroads.addRoute(hash),
            before = [];

        routeObj.enter = function (func) {
            before.push(func);
            return routeObj;
        };

        routeObj.to = function (func) {
            route.matched.add(function () {
                var i;
                for (i = 0; i < before.length; ++i) {
                    // Call the before-callback with a copy of the route arguments
                    before[i].apply(before[i], Array.prototype.slice.call(arguments, 0));
                }

                func.apply(func, Array.prototype.slice.call(arguments, 0));
            });

            return routeObj;
        };

        routeObj.exit = function (func) {
            route.switched.add(func);

            return routeObj;
        };

        return routeObj;
    };

    // Helper function for changing to a different path
    router.go = function (path) {
        hasher.setHash(path);
    };

    return router;
});