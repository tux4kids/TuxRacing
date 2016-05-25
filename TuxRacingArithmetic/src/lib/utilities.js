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
/*global define:true */
define("lib/utilities",
    [],
    function () {
        /**
         * A module of shared utility functions
         *
         * @exports utilities
         */
        var module = {};

        /**
         * Outputs a random number in the given range
         *
         * @param {Number} lowerBound Lower bound for the range
         * @param {Number} upperBound Upper bound for the range
         * @returns {Number}
         */
        module.randomInRange = function (lowerBound, upperBound) {
            return lowerBound + Math.random() * (upperBound - lowerBound) | 0;
        };

        /**
         * Randomly shuffles an array using the Fisher Yates algorithm
         *
         * @param {Array} a input array to randomly shuffle
         * @return {Array}
         */
        module.fisherYates = function (a) {
            var tmp, i, j;
            for (i = a.length - 1; i > 0; --i) {
                j = Math.random() * (i + 1) | 0; // j is random in [0 .. i]
                temp = a[j];
                a[j] = a[i];
                a[i] = temp;
            }
            return a;
        };

        /**
         * Asynchronously fetch a JSON file via XMLHttpRequest without regard for old/MS browsers
         *
         * @param {string} method String representation of the request method to use
         * @param {string} url String representation of the resource URL to fetch
         * @param {function} callback Function accepting err and data as input
         */
        module.jsonLoad = function (method, url, callback) {
            var req = new XMLHttpRequest();
            // Asynchronously fetch the URL with the given method
            req.open(method, url, true);
            req.onreadystatechange = function () {
                // Request complete when state = 4
                if (req.readyState === 4) {
                    var document = JSON.parse(req.responseText);
                    callback(document);
                }
            };
            req.send(null);
        };

        return module;
    }
);
