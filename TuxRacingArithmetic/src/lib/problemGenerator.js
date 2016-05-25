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
define("lib/problemGenerator",
    ["./utilities", "./addition/problemGenerator", "./subtraction/problemGenerator",
    "./multiplication/problemGenerator", "./division/problemGenerator"],
    function (utils, addition, subtraction, multiplication, division) {
        /**
         * A functional problem generator class that wraps all the specialized
         * generators by taking in a lesson specification and returning a
         * generator that randomly selects one of the arithmetic generators.
         *
         * @exports arithmetic
         * @requires utils
         * @requires addition/problemGenerator
         * @requires subtraction/problemGenerator
         * @requires multiplication/problemGenerator
         * @requires division/problemGenerator
         */
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
            var that = {},
                generators = [];

            // Set a default of 4 choices, since tux math lesson specs don't include this
            spec.choice_count = spec.choice_count || 4;

            if (spec.addition_allowed) {
                generators.push(addition(spec));
            }

            if (spec.subtraction_allowed) {
                generators.push(subtraction(spec));
            }

            if (spec.division_allowed) {
                generators.push(division(spec));
            }

            if (spec.multiplication_allowed) {
                generators.push(multiplication(spec));
            }

            /**
             * Return lesson-specific target rates
             * @return {Array} Two target rates, order is irrelevant
             */
            that.targetRates = function () {
                return [spec.firstPlace, spec.secondPlace];
            };

            /**
             * Returns the "maximum" lesson rate. This should be a little bit higher than 1st place.
             * @return {*}
             */
            that.maximumRate = function () {
                return spec.maxRate;
            };

            that.duration = function () {
                return spec.duration;
            };


            /**
             * Returns a random problem generated from a randomly selected enabled generator
             *
             * @public
             * @method
             * @return {problem}
             */
            that.generate = function () {
                return generators[utils.randomInRange(0, generators.length)].generate();

            };

            return that;
        };

        return module.problemGenerator;
    }
);
