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
define("lib/multiplication/problemGenerator",
    ["../utilities", "../problemGeneratorBase"],
    function (util, problemGeneratorBase) {
        /**
         * A functional problem generator class that specializes the base
         * problem generator for multiplication.
         *
         * @exports multiplication/problemGenerator
         * @requires utilities
         * @requires problemGeneratorBase
         */
        var module = {};

        /**
         * Implements a problem generator for basic multiplication problems
         *
         * @class
         * @augments module:problemGeneratorBase.problemGeneratorBase
         * @param {Object} spec problem generator/lesson specifications
         * @param {Boolean} spec.format_answer_first Enable/disable ? OP B = C format
         * @param {Boolean} spec.format_answer_middle Enable/disable A OP ? = C format
         * @param {Boolean} spec.format_answer_last Enable/disable A OP B = ? format
         * @param {Number} spec.choice_count Number of random choices to attach to problems
         * @param {Number} spec.min_multiplier Lowest possible multiplier value
         * @param {Number} spec.max_multiplier Largest possible multiplier value
         * @param {Number} spec.min_multiplicand Lowest possible multiplicand value
         * @param {Number} spec.max_multiplicand Largest possible multiplicand value
         * @param {Number} spec.max_answer Largest acceptable equation result
         * @param {Boolean} spec.allow_negatives Enable/disable negative equation results
         *
         */
        module.problemGenerator = function (spec) {
            var that = problemGeneratorBase(spec);

            /**
             * String representation of the multiplication operator
             * @type {String}
             * @field
             */
            var symbol = '*';
            that.symbol = symbol;

            /**
             * Object representation of the answer limits for various formats. Array maps 1-1 to the format numbers
             * @type {Array}
             * @field
             */
            var choiceRanges = [
                {
                    min: spec.min_multiplier,
                    max: spec.max_multiplier
                },
                {
                    min: spec.min_multiplicand,
                    max: spec.max_multiplicand
                },
                {
                    min: spec.min_multiplier * spec.min_multiplicand,
                    max: spec.max_multiplier * spec.max_multiplicand
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
                var multiplier, multiplicand, product;
                var equations = [];
                for (multiplier = spec.min_multiplier; multiplier < spec.max_multiplier; multiplier++) {
                    for (multiplicand = spec.min_multiplicand; multiplicand < spec.max_multiplicand; multiplicand++) {
                        product = multiplier * multiplicand;
                        if (product < spec.max_answer && (product >= 0 || spec.allow_negatives)) {
                            equations.push([
                                multiplier,
                                multiplicand,
                                product
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
                var multiplier, multiplicand, product;

                // TODO
                // Throw if lesson.max_answer > max_multiplier * max_multiplicand?
                do {
                    multiplier = util.randomInRange(spec.min_multiplier, spec.max_multiplier);
                    multiplicand = util.randomInRange(spec.min_multiplicand, spec.max_multiplicand);
                    product = multiplier * multiplicand;
                } while (product > spec.max_answer || (product < 0 && !spec.allow_negatives));

                return [
                    multiplier,
                    multiplicand,
                    product
                ];
            };
            that.equationGenerator = equationGenerator;
            
            return that;
        };

        return module.problemGenerator;
    }
);
