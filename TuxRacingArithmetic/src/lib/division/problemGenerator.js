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
define("lib/division/problemGenerator",
    ["../utilities", "../problemGeneratorBase"],
    function (util, problemGeneratorBase) {
        /**
         * A functional problem generator class that specializes the base
         * problem generator for division.
         *
         * @exports division/problemGenerator
         * @requires utilities
         * @requires problemGeneratorBase
         */
        var module = {};

        /**
         * Implements a problem generator for basic division problems
         *
         * @class
         * @augments module:problemGeneratorBase.problemGeneratorBase
         * @param {Object} spec problem generator/lesson specifications
         * @param {Boolean} spec.format_answer_first Enable/disable ? OP B = C format
         * @param {Boolean} spec.format_answer_middle Enable/disable A OP ? = C format
         * @param {Boolean} spec.format_answer_last Enable/disable A OP B = ? format
         * @param {Number} spec.choice_count Number of random choices to attach to problems
         * @param {Number} spec.min_divisor Lowest possible divisor value
         * @param {Number} spec.max_divisor Largest possible divisor value
         * @param {Number} spec.min_quotient Lowest possible quotient value
         * @param {Number} spec.max_quotient Largest possible quotient value
         * @param {Number} spec.max_answer Largest acceptable equation result
         * @param {Boolean} spec.allow_negatives Enable/disable negative equation results
         *
         */
        module.problemGenerator = function (spec) {
            var that = problemGeneratorBase(spec);

            /**
             * String representation of the division operator
             * @public
             * @type {String}
             * @field
             */
            var symbol = '/';
            that.symbol = symbol;

            /**
             * Object representation of the answer limits for various formats. Array maps 1-1 to the format numbers
             * @public
             * @type {Array}
             * @field
             */
            var choiceRanges = [
                {
                    min: spec.min_divisor * spec.min_quotient,
                    max: spec.max_divisor * spec.max_quotient
                },
                {
                    min: spec.min_divisor,
                    max: spec.max_divisor
                },
                {
                    min: spec.min_quotient,
                    max: spec.max_quotient
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
                var quotient, divisor, dividend;
                var equations = [];
                for (quotient = spec.min_quotient; quotient < spec.max_quotient; ++quotient) {
                    for (divisor = spec.min_divisor; divisor < spec.max_divisor; ++divisor) {
                        dividend = divisor * quotient;
                        if (quotient < spec.max_answer && (quotient >= 0 || spec.allow_negatives)) {
                            equations.push([
                                dividend,
                                divisor,
                                quotient
                            ]);
                        }
                    }
                }
                return equations;
            };
            that.permutations = permutations;

            /**
             * Returns a random equation given the specification limits, required for the base-class
             * @public
             * @method
             * @return {Array}
             */
            var equationGenerator = function () {
                var divisor, quotient, dividend;

                do {
                    divisor = util.randomInRange(spec.min_divisor, spec.max_divisor);
                    quotient = util.randomInRange(spec.min_quotient, spec.max_quotient);
                    dividend = divisor * quotient;
                } while (divisor === 0 || quotient > spec.max_answer || (quotient < 0 && !spec.allow_negatives));

                return [
                    dividend,
                    divisor,
                    quotient
                ];
            };
            that.equationGenerator = equationGenerator;
            return that;
        };

        return module.problemGenerator;
    }
);
