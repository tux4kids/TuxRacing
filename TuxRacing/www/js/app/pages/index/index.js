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
define(["tpl!./tpl/tpl_index.html", "i18n!./nls/i18n_index", "router", "utilities"], function (view, text, router, utilities) {
    // Simple listen->display page for displaying the index page contents
    router.map('index').to(function () {
        // Render index page view with the page class indexPage
        utilities.display("indexPage", view({
            text: text
        }));

        // Setup a click handler on the settings link to automatically trigger
        // the TR menu button event (which displays the settings overlay)
        utilities.clickHandler($("#displaySettings"), function(e) {
            e.preventDefault();
            e.stopPropagation();

            $(document).trigger("TR:menubutton");
        });

        // Setup a click handler for the quit link, if it exists. Simply
        // exits the app. Link is commented out in the template if the app
        // isn't running from inside the phonegap wrapper.
        utilities.clickHandler($("#quitLink"), function (e) {
            e.preventDefault();
            navigator.app.exitApp();
            return false;
        });
    });
});