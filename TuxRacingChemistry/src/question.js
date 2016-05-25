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
define("question",
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
         * @param {String} prompt A string representing the question prompt
         * @param {String} answer A string representation of the correct answer
         * @return {Object}
         */
        module.question = function (prompt, correctAnswer) {
            var self = {};

            /**
             * Outputs the question prompt
             * @return {String}
             */
            self.toString = function () {
                return prompt;
            };

            /**
             * Validates an input answer against the true answer
             * @param {String} answer Input answer to check against the correct answer (case-sensitive)
             * @return {Boolean}
             */
            self.checkAnswer = function (answer) {
                return correctAnswer == answer;
            };

            return self;
        };

        return module.question;
    }
);
