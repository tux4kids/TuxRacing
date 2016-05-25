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
define("lib/problemGeneratorBase",
    ["./utilities", "./question", "./problem"],
    function (util, questionConstructor, problemConstructor) {
        // Note: We need to use this dummy exports object to get JSDoc working properly
        /**
         * A functional abstract class for the different arithmetic generators.
         *
         * @exports problemGeneratorBase
         * @requires utilities
         * @requires question
         * @requires problem
         */
        var module = {};

        /**
         * Abstract base-class for problem generators. Derived classes must
         * implement equationGenerator(), choiceRanges, symbol
         *
         * @class
         * @param {Object} spec Problem generator/lesson specification object
         * @param {Boolean} spec.format_answer_first Enable/disable ? OP B = C format
         * @param {Boolean} spec.format_answer_middle Enable/disable A OP ? = C format
         * @param {Boolean} spec.format_answer_last Enable/disable A OP B = ? format
         * @param {Number} spec.choice_count Number of random choices to attach to problems
         */
        module.problemGeneratorBase = function (spec) {
            var that = {};

            /**
             * An array of enabled formats in their numeric form
             *
             * @private
             * @type {Array}
             * @field
             */
            var formats = [];
            // First format corresponds to _ OP B = C
            if (spec.format_answer_first) {
                formats.push(0);
            }
            // Middle format corresponds to A OP _ = C
            if (spec.format_answer_middle) {
                formats.push(1);
            }
            // Third format corresponds to A OP B = _
            if (spec.format_answer_last) {
                formats.push(2);
            }

            /**
             * Randomly selects a format from the format list
             *
             * @private
             * @method
             * @return {Number}
             */
            var randomFormat = function () {
                return formats[util.randomInRange(0, formats.length)];
            };
            // Make available for unit testing
            // class uses private reference so overwriting won't change behavior
            that.randomFormat = randomFormat;

            /**
             * Basically just generates an array containing @count elements, with
             * with @count - 1 selected from @min_value to @max_value, in
             * addition to @answer. Optionally outputs unique elements.
             *
             * @private
             * @method
             * @param {Number} min_value Random range's lower bounds
             * @param {Number} max_value Random range's upper bounds
             * @param {Number} count Number of elements the resulting array should have
             * @param {Number} answer The correct answer, randomly inserted into the choices list
             * @param {Boolean} unique Determines whether or not to enforce unique choices
             * @return {Array}
             */
            // TODO This should throw if the range < count and unique is true
            var createChoices = function (min_value, max_value, count, answer, unique) {
                var choices = [],
                    choice,
                    i;

                count = count - 1; // Answer takes up a slot
                for (i = 0; i < count; i++) {

                    // If unique is set, loops until a unique choice in the range is found
                    // otherwise just runs once
                    do {
                        choice = util.randomInRange(min_value, max_value);
                    } while (unique && (choice === answer || choices.indexOf(choice) !== -1));

                    choices.push(choice);
                }

                // Insert correct answer
                choices.splice(util.randomInRange(0, choices.length), 0, answer);
                return choices;
            };
            // Make available for unit testing
            // class uses private reference so overwriting won't change behavior
            that.createChoices = createChoices;

            /**
             *
             * @param equation
             * @param format
             * @return {*}
             */
            var createProblem = function (equation, format) {
                var question = questionConstructor(equation, format, that.symbol),
                    choiceRange = that.choiceRanges[format],
                    choices = createChoices(choiceRange.min, choiceRange.max, spec.choice_count, equation[format], true);
                return problemConstructor(question, choices);
            };

            /**
             * Generates a random problem using the specification passed to the
             * constructor. Requires augmentation by derived classes to function.
             *
             * @public
             * @method
             *
             * @return {problem}
             */
            var generate = function () {
                var equation = that.equationGenerator(),
                    format = randomFormat();
                return createProblem(equation, format);
            };
            that.generate = generate;

            /**
             * Returns an array of problems representing all permutations of
             * equation and format inputs. Not randomized, use
             * utilities.fisherYates to randomly shuffle the problem array
             * @return {Array}
             */
            var generateAll = function () {
                var equations = that.permutations(),
                    problems = [],
                    i, k;

                for (i = 0; i < equations.length; i++) {
                    for (k = 0; k < formats.length; k++) {
                        problems.push(createProblem(equations[i], formats[k]));
                    }
                }

                return problems;
            };
            that.generateAll = generateAll;

            return that;
        };
        return module.problemGeneratorBase;
    }
);
