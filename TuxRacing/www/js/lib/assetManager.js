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
    /**
     * Simple asset manager, providing only download/temporary caching
     * Assets are queued via the download method, and raw accessed via the
     * cache object. Currently only supports image assets.
     *
     * @type {Object}
     */
    var module = {
            cache: {}
        };

    /**
     * Queue downloads of image assets. Pass in an object with keys as cache
     * lookups and values are image urls. Key is used for cache check, already
     * downloaded images will not be re-downloaded. Callback is called on
     * completion, and will be passed a boolean indicating if all requests
     * went through successfully (true) or if there were errors (false).
     *
     * @param assets
     * @param callback
     */
    module.download = function (assets, callback) {
        var assetArray = [],
            finished = 0,
            label;

        for (label in assets) {
            if (assets.hasOwnProperty(label)) {
                assetArray.push(label);
            }
        }

        for (var i = 0; i < assetArray.length; i++) {
            if (module.cache[label]) {
                finished++
            } else {
                (function (label) {
                    var img = new Image();
                    img.addEventListener("load", function () {
                        finished++;
                        module.cache[label] = img;
                        if (finished === assetArray.length) {
                            callback(true);
                        }
                    }, false);
                    img.addEventListener("error", function () {
                        callback(false);
                    }, false);
                    img.src = assets[label];
                })(assetArray[i]);
            }
        }
        if (finished === assetArray.length) {
            callback(true);
        }
    };

    return module;
});