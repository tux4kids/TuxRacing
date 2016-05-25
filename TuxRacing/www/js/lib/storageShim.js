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
/*
 *
 * Shim function for selecting the ideal data store and presenting a uniform interface
 * 
 * var store = shim(dbName);
 * var value = store.getItem(key);
 * store.setItem(key, value);
 */
define(function () {
    return function (dbPrefix) {
        var module = {};

        // First try to use appMobi's cookie/cache for storage (localStorage isn't guaranteed)
        if (window.AppMobi) {
            module.getItem = function (key, default_val) {
                return AppMobi.cache.getCookie(dbPrefix + ':' + key) || default_val;
            };

            module.setItem = function (key, value) {
                AppMobi.cache.setCookie(dbPrefix + ':' + key, value);
                return module;
            };

        // If we're not in the mobile wrapper, use localStorage
        // TODO Fall back on cookies after trying localStorage
        } else {
            module.getItem = function (key, default_val) {
                return localStorage.getItem(dbPrefix + ':' + key) || default_val;
            };

            module.setItem = function (key, value) {
                localStorage.setItem(dbPrefix + ':' + key, value);
                return module;
            };
        }

        // Basic transactions
        module.transaction = function () {
            var subModule = {},
                updates = {};

            subModule.setItem = function (key, value) {
                updates[key] = value;
            };

            subModule.getItem = function (key) {
                if (updates.hasOwnProperty(key)) {
                    return updates[key];
                } else {
                    return module.getItem(key);
                }
            };

            subModule.rollBack = function () {
                updates = {};
                return subModule;
            };

            subModule.commit = function () {
                var key;
                for (key in updates) {
                    if (updates.hasOwnProperty(key)) {
                        module.setItem(key, updates[key]);
                    }
                }
                updates = {};
                return subModule;
            };
        };

        return module;
    };
});
