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
    "tpl!./tpl/tpl_finish.html",
    "i18n!./nls/i18n_finish",
    "router",
    "utilities"
], function (view, text, router, utilities) {
    // Simple listen->display page
    router.map("results/{shortName}/{first}/{second}/{third}").to(function (args) {
        utilities.display("resultsPage", view({
            text: text,
            first: text[args.first],
            second: text[args.second],
            third: text[args.third],
            moduleName: args.shortName
        }));
    });
});