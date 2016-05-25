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
define(["problemGenerator", "json!master.json", "i18n!nls/info.js", "nls/info.js"],
    function (generator, lessonMaster, moduleInfo, localeMaster) {
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

        module.exercises = function () {
            var masterCopy = [],
                i;

            // Copies the lesson master to prevent damage it
            for (i = 0; i < lessonMaster.length; i++) {
                masterCopy[i] = {
                    title: lessonMaster[i].title,
                    path: lessonMaster[i].path,
                    id: lessonMaster[i].id
                };
            }
            return masterCopy;
        };

        module.exercise = function (id, callback) {
            var lesson, i;
            for (i = 0; i < lessonMaster.length; i++) {
                if (lessonMaster[i].id === id) {
                    lesson = lessonMaster[i];
                    break;
                }
            }
            if (!lesson) {
                throw "Error: no matching id in chemistry lesson module";
            }

           TR.getJSON(moduleBase + lesson.path, function (document) {
                callback(generator(document));
            });
        };

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

        TR.moduleLoaded.dispatch(moduleInfo.refName, module);
    }
);
