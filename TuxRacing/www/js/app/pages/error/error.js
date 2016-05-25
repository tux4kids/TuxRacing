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
define(["tpl!./tpl/tpl_error.html", "i18n!./nls/i18n_error", "utilities"],
    /**
     * Module provides a simple interface for displaying an error page. args can
     * contain errorMsg, backLabel, backLocation.
     *
     * @param view
     * @param text
     * @param utilities
     * @return {Object}
     */
    function (view, text, utilities) {
        return {
            display: function (args) {
                args.text = text;
                utilities.display("errorPage", view(args));
            }
        };
    }
);