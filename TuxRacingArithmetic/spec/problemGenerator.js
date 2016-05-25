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
/*global require:true, describe:true, it:true, expect:true */
require(
    ["problemGenerator"],
    function (problemGenerator) {
    describe('problemGenerator', function () {
        it('obeys addition option', function () {
            var gen = problemGenerator({
                    format_answer_first: 1,
                    format_answer_last: 0,
                    format_answer_middle: 0,
                    addition_allowed: 1,
                    min_augend: 1,
                    max_augend: 1,
                    min_addend: 1,
                    max_addend: 1,
                    choice_count: 1,
                    max_answer: 144,
                    allow_negatives: false
                });
            expect(gen.generate().question.toString()).toEqual("? + 1 = 2");
        });

        it('obeys division option', function () {
            var gen = problemGenerator({
                format_answer_first: 1,
                format_answer_last: 0,
                format_answer_middle: 0,
                division_allowed: 1,
                min_quotient: 1,
                max_quotient: 1,
                min_divisor: 1,
                max_divisor: 1,
                choice_count: 1,
                max_answer: 144,
                allow_negatives: false
            });
            expect(gen.generate().question.toString()).toEqual("? / 1 = 1");
        });

        it('obeys subtraction option', function () {
            var gen = problemGenerator({
                format_answer_first: 1,
                format_answer_last: 0,
                format_answer_middle: 0,
                subtraction_allowed: 1,
                min_minuend: 1,
                max_minuend: 1,
                min_subtrahend: 1,
                max_subtrahend: 1,
                choice_count: 1,
                max_answer: 144,
                allow_negatives: false
            });
            expect(gen.generate().question.toString()).toEqual("? - 1 = 0");
        });

        it('obeys multiplication option', function () {
            var gen = problemGenerator({
                format_answer_first: 1,
                format_answer_last: 0,
                format_answer_middle: 0,
                multiplication_allowed: 1,
                min_multiplier: 1,
                max_multiplier: 1,
                min_multiplicand: 1,
                max_multiplicand: 1,
                choice_count: 1,
                max_answer: 144,
                allow_negatives: false
            });
            expect(gen.generate().question.toString()).toEqual("? * 1 = 1");
        });
    });
});
