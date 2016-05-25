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
    "tpl!./tpl/tpl_module.html",
    "i18n!./nls/i18n_module",
    "router",
    "TR",
    "utilities",
    "app/pages/error/error"
],
    function (view, text, router, TR, utilities, error) {
        // Updates the page with the exercise list from the module
        var updateView = function (shortName, module) {
                var exercises = module.exercises(),
                    collectedStars = 0,
                    lookupKeyBase = 'tr.module.' + shortName + '.exercise.',
                    maxStars, i, exercise;

                // Every exercise can have up to 3 stars, find the number of
                // stars for each exercise and the total collected stars.
                maxStars = exercises.length * 3;
                for (i = 0; i < exercises.length; i++) {
                    exercise = exercises[i];

                    // Lookup the number of stars collected for the exercise
                    exercise.stars = Math.min(
                        utilities.store.getItem(lookupKeyBase + exercise.id, 0),
                        3
                    );

                    // Track the total number of collected stars
                    collectedStars += exercise.stars;
                }

                // Render the exercise list view
                utilities.display("module", view({
                    text:text,
                    exercises:exercises,
                    maxStars:maxStars,
                    collectedStars:collectedStars,
                    module:module,
                    backLocation:"#/moduleList"
                }));
            },
            moduleListener;

        // Render the exercise list if the module is already loaded
        // Also setup and tear down listeners which update the contents if the module gets loaded
        router.map('module/{shortName}').enter(function (params) {
                moduleListener = function (shortName, module) {
                    if (shortName === params.shortName) {
                        updateView(shortName, module);
                    }
                };

                TR.moduleLoaded.add(moduleListener);
            }).to(function (params) {
                // Display the module page if it's already loaded
                if (TR.practiceModule(params.shortName)) {
                    updateView(params.shortName, TR.practiceModule(params.shortName));

                // Otherwise display an error page, which gets overwritten if/when
                // the page gets loaded.
                } else {
                    // Display the unknown module error page if the module can't be loaded immediately
                    error.display({
                        errorMsg: text.moduleUnknown,
                        backLabel: text.backLabel,
                        backLocation: "#/moduleList"
                    });
                }
            // Remove the listener for new modules when the page gets exited
            }).exit(function () {
                TR.moduleLoaded.remove(moduleListener);
            });
    });