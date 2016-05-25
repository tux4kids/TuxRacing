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
define("problem",
    [],
    function () {
        /**
         * A module representing a problem
         *
         * @exports problem
         */
        var module = {};

        /**
         * Constructs an object representing a problem, a simple composite of
         * a question and the associated choices
         *
         * @class
         * @param {question} question Question object that implements checkAnswer
         * @param {Array} choices An array of possible answers (including the correct one)
         * @return {Object}
         */
        module.problem = function (question, choices) {
            return {
                question: question,
                choices: choices
            };
        };

        return module.problem;
    }
);
