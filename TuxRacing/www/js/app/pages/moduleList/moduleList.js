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
    "tpl!./tpl/tpl_moduleList.html",
    "i18n!./nls/i18n_moduleList",
    "router",
    "TR",
    "utilities",
    "app/pages/error/error"
], function (
    view,
    text,
    router,
    TR,
    utilities,
    error
    ) {

    // Compares two modules and sorts them by their name
    function byModuleName(a, b) {
        if (a.name() === b.name()) {
            return 0;
        } else if (a.name() > b.name()) {
            return 1;
        } else {
            return -1;
        }
    }

    // Display currently available modules
    var updateHomepage = function () {
        var supportedModules = [],
            unsupportedModules = [],
            i, module, modules;

        // Get locale supported/unsupported modules
        modules = TR.practiceModules();
        for (i = 0; i < modules.length; i++) {
            module = modules[i];

            if (module.supportsLocale && module.supportsLocale()) {
                supportedModules.push(module);
            } else {
                unsupportedModules.push(module);
            }
        };

        // If there aren't any modules available, error
        if (!supportedModules.length && !unsupportedModules.length) {
            error.display({
                errorMsg: text.error.noModules,
                backLabel: text.backLabel,
                backLocation:'#/index'
            });
        } else {
            // Sort both supported and unsupported modules by name
            supportedModules.sort(byModuleName);
            unsupportedModules.sort(byModuleName);

            // Render the localized/dynamic page text
            utilities.display("moduleList", view({
                text:text,
                supportedModules: supportedModules,
                unsupportedModules: unsupportedModules
            }));
        }
    };

    // Update the homepage when new modules are loaded
    // Should only be triggered when the first page load is home, in which
    // case the modules are loaded asynchronously
    router.map('moduleList').enter(function () {
            TR.moduleLoaded.add(updateHomepage);

        // Render the homepage with all currently available modules
        }).to(function () {
            updateHomepage();

        // Remove the module listener when leaving the homepage
        }).exit(function () {
            TR.moduleLoaded.remove(updateHomepage);
        });
});