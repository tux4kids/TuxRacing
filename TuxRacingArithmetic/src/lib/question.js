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
define("lib/question",
    [],
    function () {
        /**
         * A module representing a question
         *
         * @exports question
         */
        var module = {};

        /**
         * Builds an object representing a question
         *
         * @class
         * @param {Array} equation An array representing an equation, where the first n - 1 elements are applied to the operator and the last element is the result
         * @param {Number} format Formats are numbers that determine which number is missing from the equation (represent indices to the equation passed)
         * @param {String} operator A string representation of the operator for the question
         * @return {Object}
         */
        module.question = function (equation, format, operator) {
            // Create a local copy of the equation since arrays are modified in-place
            var eq = equation.slice(0),
                correctAnswer = eq[format],
                that = {};
            eq[format] = "?";

            /**
             * Outputs the string representation of the question
             * @return {String}
             */
            that.toString = function () {
                return [eq[0], operator, eq[1], "=", eq[2]].join(" ");
            };

            /**
             * Validates an input answer against the true answer
             * @param answer Input answer to check against the correct answer
             * @return {Boolean}
             */
            that.checkAnswer = function (answer) {
                return correctAnswer == answer;
            };

            return that;
        };

        return module.question;
    }
);
