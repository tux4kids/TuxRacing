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
        'TR',
        "router",
        "utilities",
        "app/pages/settings/settings",
        "app/pages/moduleList/moduleList",
        "app/pages/module/module",
        "app/pages/exercise/exercise",
        "app/pages/exercise/results",
        "app/pages/index/index",
        "helper",
        "jquery",
        "cordova-2.0.0"
    ], function(
        TR,
        router,
        utilities,
        settings
    ) {
        var DEFAULT_PATH = '/index';

        // Initialize TR by setting the base directory for modules
        TR.init('defaultModules/');

        // Start the router when the page is finished loading
        // Default hash is the index
        $(function ($) {
            MBP.scaleFix();

            // Setup a new event for the back button. Currently just used by
            // the phonegap backbutton event.
            // Backbutton will follow the backButton link on the page, if there
            // is one. It's not a true backbutton.
            $.Event("TR:backbutton");
            $(document).on("TR:backbutton", function () {
                var backLink = $(".backButton a"),
                    href;

                // If settings are displayed, close them before following the
                // underlying page back link
                if (settings.settingsVisible()) {
                    settings.hideSettings();

                // Otherwise check for back links to follow
                } else if (backLink.length) {
                    href = backLink.first().attr("href");
                    router.go(href);

                }
            });

            // Setup an event for toggling display of the settings overlay.
            // Currently just used by the phonegap menubutton
            $.Event("TR:menubutton");
            $(document).on("TR:menubutton", function () {
                settings.toggleSettings();
            });

            router.init(DEFAULT_PATH);
        });

        // Phonegap init
        $(document).on("deviceready", function () {
            // Route phonegap's backbutton through TR:backbutton
            $(document).on("backbutton", function () {
                $(document).trigger("TR:backbutton");
            });

            // Route phonegap's menubutton through TR:menubutton
            $(document).on("menubutton", function () {
                $(document).trigger("TR:menubutton");
            });
        });
    }
);
 
