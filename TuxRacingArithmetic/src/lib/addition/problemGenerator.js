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
define("lib/addition/problemGenerator",
    ["../utilities", "../problemGeneratorBase"],
    function (util, problemGeneratorBase) {
        /**
         * A functional problem generator class that specializes the base
         * problem generator for addition.
         *
         * @exports addition/problemGenerator
         * @requires utilities
         * @requires problemGeneratorBase
         */
        var module = {};

        /**
         * Implements a problem generator for basic addition problems
         *
         * @class
         * @augments module:problemGeneratorBase.problemGeneratorBase
         * @param {Object} spec problem generator/lesson specifications
         * @param {Boolean} spec.format_answer_first Enable/disable ? OP B = C format
         * @param {Boolean} spec.format_answer_middle Enable/disable A OP ? = C format
         * @param {Boolean} spec.format_answer_last Enable/disable A OP B = ? format
         * @param {Number} spec.choice_count Number of random choices to attach to problems
         * @param {Number} spec.min_augend Lowest possible augend value
         * @param {Number} spec.max_augend Largest possible augend value
         * @param {Number} spec.min_addend Lowest possible addend value
         * @param {Number} spec.max_addend Largest possible addend value
         * @param {Number} spec.max_answer Largest acceptable equation result
         * @param {Boolean} spec.allow_negatives Enable/disable negative equation results
         *
         */
        module.problemGenerator = function (spec) {
            var that = problemGeneratorBase(spec);

            /**
             * String representation of the addition operator
             * @type {String}
             * @field
             */
            var symbol = '+';
            that.symbol = symbol;

            /**
             * Object representation of the answer limits for various formats. Array maps 1-1 to the format numbers
             * @type {Array}
             * @field
             */
            var choiceRanges = [
                    {
                        min: spec.min_augend,
                        max: spec.max_augend
                    },
                    {
                        min: spec.min_addend,
                        max: spec.max_addend
                    },
                    {
                        min: spec.min_augend + spec.min_addend,
                        max: spec.max_augend + spec.max_addend
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
                var augend, addend, sum;
                var equations = [];
                for (augend = spec.min_augend; augend < spec.max_augend; ++augend) {
                    for (addend = spec.min_addend; addend < spec.max_addend; ++addend) {
                        sum = augend + addend;
                        if (sum < spec.max_answer && (sum >= 0 || spec.allow_negatives)) {
                            equations.push([
                                augend,
                                addend,
                                sum
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
                    var augend, addend, sum;

                    do {
                        augend = util.randomInRange(spec.min_augend, spec.max_augend);
                        addend = util.randomInRange(spec.min_addend, spec.max_addend);
                        sum = augend + addend;
                    } while (sum > spec.max_answer || (sum < 0 && !spec.allow_negatives));

                    return [
                        augend,
                        addend,
                        sum
                    ];
                };
            that.equationGenerator = equationGenerator;
            
            return that;
        };

        return module.problemGenerator;
    }
);
