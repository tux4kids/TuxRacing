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
define("lib/subtraction/problemGenerator",
    ["../utilities", "../problemGeneratorBase"],
    function (util, problemGeneratorBase) {
        /**
         * A functional problem generator class that specializes the base
         * problem generator for subtraction.
         *
         * @exports subtraction/problemGenerator
         * @requires utilities
         * @requires problemGeneratorBase
         */
        var module = {};

        /**
         * Implements a problem generator for basic subtraction problems
         *
         * @class
         * @augments module:problemGeneratorBase.problemGeneratorBase
         * @param {Object} spec problem generator/lesson specifications
         * @param {Boolean} spec.format_answer_first Enable/disable ? OP B = C format
         * @param {Boolean} spec.format_answer_middle Enable/disable A OP ? = C format
         * @param {Boolean} spec.format_answer_last Enable/disable A OP B = ? format
         * @param {Number} spec.choice_count Number of random choices to attach to problems
         * @param {Number} spec.min_minuend Lowest possible minuend value
         * @param {Number} spec.max_minuend Largest possible minuend value
         * @param {Number} spec.min_subtrahend Lowest possible subtrahend value
         * @param {Number} spec.max_subtrahend Largest possible subtrahend value
         * @param {Number} spec.max_answer Largest acceptable equation result
         * @param {Boolean} spec.allow_negatives Enable/disable negative equation results
         *
         */
        module.problemGenerator = function (spec) {
            var that = problemGeneratorBase(spec);

            /**
             * String representation of the subtraction operator
             * @type {String}
             * @field
             */
            var symbol = '-';
            that.symbol = symbol;

            /**
             * Object representation of the answer limits for various formats. Array maps 1-1 to the format numbers
             * @type {Array}
             * @field
             */
            var choiceRanges = [
                {
                    min: spec.min_minuend,
                    max: spec.max_minuend
                },
                {
                    min: spec.min_subtrahend,
                    max: spec.max_subtrahend
                },
                {
                    min: spec.min_minuend - spec.max_subtrahend,
                    max: spec.max_minuend - spec.min_subtrahend
                }
            ];
            that.choiceRanges = choiceRanges;

            /**
             * Generates all equation permutations given the lesson specification.
             * These equations are used by the problem generator base class to
             * create all problem permutations (considering enabled formats).
             * @return {Array}
             */
            var permutations = function () {
                var minuend, subtrahend, difference;
                var equations = [];
                for (minuend = spec.min_minuend; minuend < spec.max_minuend; ++minuend) {
                    for (subtrahend = spec.min_subtrahend; subtrahend < spec.max_subtrahend; ++subtrahend) {
                        difference = minuend - subtrahend;
                        if (difference < spec.max_answer && (difference >= 0 || spec.allow_negatives)) {
                            equations.push([
                                minuend,
                                subtrahend,
                                difference
                            ]);
                        }
                    }
                }
                return equations;
            };
            that.permutations = permutations;

            /**
             * Returns a random equation given the specification limits, required for the base-class
             * @return {Array}
             */
            var equationGenerator = function () {
                var minuend, subtrahend, difference;

                // TODO
                // Throw if max minuend < min subtrahend and allow_negatives = false
                // under this condition, the difference will *always* be negative
                do {
                    minuend = util.randomInRange(spec.min_minuend, spec.max_minuend);
                    subtrahend = util.randomInRange(spec.min_subtrahend, spec.max_subtrahend);
                    difference = minuend - subtrahend;
                } while (difference > spec.max_answer || (difference < 0 && !spec.allow_negatives));

                return [
                    minuend,
                    subtrahend,
                    difference
                ];
            };
            that.equationGenerator = equationGenerator;
            
            return that;
        };

        return module.problemGenerator;
    }
);
