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

define('main',
    ["lib/problemGenerator", "json!master.json", "i18n!nls/info.js", "nls/info.js"],
    function (generator, practiceMaster, moduleInfo, localeMaster) {
        /**
         * Contains the practice module and provides the standard module interface
         *
         * @exports problem
         */
        var module = {},
            moduleBase = TR.modulePath(moduleInfo.refName);

        /**
         * Returns the practice module's description
         *
         * @return {string} module description
         */
        module.description = function () {
            return moduleInfo.description;
        };

        /**
         * Provides access to the module's full name/title
         *
         * @return {string} module name
         */
        module.name = function () {
            return moduleInfo.name;
        };

        /**
         * Provides the module's short-name/reference
         *
         * @return {string} module short-name
         */
        module.ref = function () {
            return moduleInfo.refName;
        };

        /**
         * Returns an array of all available exercises. Elements are objects
         * with at least title and id attributes. ID is meant to be passed to
         * exercise()
         *
         * @return {Array} Array of available exercises
         */
        module.exercises = function () {
            var masterCopy = [],
                i;

            // Settings aren't stored in exactly the required format, so we
            // have to recreate the array. Also, a copy prevents tampering
            // of the practice master array.
            for (i = 0; i < practiceMaster.length; i++) {
                masterCopy[i] = {
                    title: practiceMaster[i].title,
                    id: practiceMaster[i].sort
                };
            }
            return masterCopy;
        };

        /**
         * Asynchronously loads the settings/exercise corresponding to the
         * exercise ID. Passes a generator initialized with the specified
         * settings to the callback.
         *
         * @param id
         * @param callback
         */
        module.exercise = function (id, callback) {
            // If there's no callbacks, there's no point in continuing
            if (!callback) {
                return module;
            }

            var filename, i;
            for (i = 0; i < practiceMaster.length; i++) {
                if (practiceMaster[i].id == id) {
                    filename = practiceMaster[i].file;
                    // Fetch JSON settings using base URL from TR
                    TR.getJSON(moduleBase + 'practices/' + filename, function (exercise) {
                        callback(generator(exercise.settings));
                    });
                    break;
                }
            }

            return module;
        };

        /**
         * Declares whether or not the module supports the currently active locale.
         *
         * return {boolean}
         */
        module.supportsLocale = function () {
            var locale = TR.getLocale(),
                parts = locale.split('-');

            // match full locale ("en-us")
            // ALso matches locale = root (use default translation strings)
            // Master provides the root locale, so compare against that as well
            if (locale === localeMaster.defaultLocale || localeMaster[locale]) {
                return true;
            }

            // Match just the language ("en" out of "en-us")
            if (parts[0] === localeMaster.defaultLocale || localeMaster[parts[0]]) {
                return true;
            }

            return false;
        };
        
        /**
         * Returns the path for the module icon
         * 
         * return {string}
         */
        module.iconPath = function () {
            return moduleBase + "icon.png";
        };

        // Hook the module into the TR master
        TR.moduleLoaded.dispatch(moduleInfo.refName, module);
    }
);
