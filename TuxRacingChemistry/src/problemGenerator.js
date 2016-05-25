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
define("problemGenerator",
    ["utilities", "problem", "question"],
    function (utils, problem, questionConstructor) {
        var module = {};

        /**
         * Returns an arithmetic problem generator that randomly selects from
         * the specified generators
         *
         * @class
         * @param {Object} spec problem generator/lesson specifications
         * @param {Boolean} spec.addition_allowed Enable/disable addition problems
         * @param {Boolean} spec.multiplication_allowed Enable/disable multiplication problems
         * @param {Boolean} spec.division_allowed Enable/disable division problems
         * @param {Boolean} spec.subtraction_allowed Enable/disable subtraction problems
         *
         */
        module.problemGenerator = function (spec) {
            var that = {};

            /**
             * Returns an array of random choices from the given array. The
             * first element in the input choices array is the correct answer.
             * All array modifications are in-place, so pass a copy if
             * necessary.
             * @param {Array=String} choices Array of the correct answer followed by several incorrect choices
             * @return {Array=String} Array randomly selected from the input choices, and includes the correct answer
             */
            var randomChoices = function (choices) {
                var correct = choices.shift(); // shift off the correct answer / first choice
                utils.fisherYates(choices); // In-place random shuffle the choices
                choices = choices.splice(0, spec.info.choices); // Keep the first spec.choice_count choices

                // Randomly add in the correct answer
                // Insert the correct answer if there's fewer than the requested number of choices
                if (choices.length < spec.info.choices) {
                    choices.splice(utils.randomInRange(0, choices.length), 0, correct);
                    // Otherwise overwrite one of the choices with the correct answer
                } else {
                    choices[utils.randomInRange(0, choices.length)] = correct;
                }
                return choices;
            };

            /**
             * Return lesson-specific target rates
             * @return {Array} Two target rates, order is irrelevant
             */
            that.targetRates = function () {
                return [spec.info.firstPlace, spec.info.secondPlace];
            };

            /**
             * Return the lesson-specific game constants
             * speed is determined by background cycles-per-second.
             * speed = player rate * c1 + c2
             * Usually both constants are < 1.
             * @return {*}
             */
            that.bgConstants = function () {
                return {
                    c1: spec.info.c1,
                    c2: spec.info.c2
                }
            };

            /**
             * Returns the "maximum" lesson rate. This should be a little bit higher than 1st place.
             * @return {*}
             */
            that.maximumRate = function () {
                return spec.info.maxRate;
            };

            that.duration = function () {
                return spec.info.duration;
            };


            /**
             * Selects a random question and returns the prepared problem object
             *
             * @return {problem} Object that has properties .question and .choices
             */
            that.generate = function () {
                var problemObj = spec.problems[utils.randomInRange(0, spec.problems.length)],
                    question = questionConstructor(problemObj.question, problemObj.choices[0]),
                    choices = randomChoices(problemObj.choices.slice(0));
                return problem(question, choices);
            };

            return that;
        };

        return module.problemGenerator;
    }
);
