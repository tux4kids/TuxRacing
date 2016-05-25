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
require(["division/problemGenerator"], function (problemGenerator) {
    describe('Derived problem generator for division', function () {
        var lesson = {
                format_answer_first: 1,
                format_answer_last: 1,
                format_answer_middle: 1,
                min_quotient: 1,
                max_quotient: 10,
                min_divisor: 1,
                max_divisor: 10,
                choice_count: 4,
                max_answer: 144,
                allow_negatives: false
            },
            generator = problemGenerator(lesson);

        it('has the proper symbol', function () {
            expect(generator.symbol).toBe('/');
        });

        it('has the proper choice ranges', function () {
            expect(generator.choiceRanges[0].min).toEqual(lesson.min_quotient * lesson.min_divisor);
            expect(generator.choiceRanges[0].max).toEqual(lesson.max_quotient * lesson.max_divisor);
            expect(generator.choiceRanges[1].min).toEqual(lesson.min_divisor);
            expect(generator.choiceRanges[1].max).toEqual(lesson.max_divisor);
            expect(generator.choiceRanges[2].min).toEqual(lesson.min_quotient);
            expect(generator.choiceRanges[2].max).toEqual(lesson.max_quotient);
        });

        it('produces acceptable equations', function () {
            var unacceptable = 0,
                equation,
                i;

            for (i = 0; i < 100; i++) {
                equation = generator.equationGenerator();
                if (equation[0] / equation[1] != equation[2] ||
                    equation[2] > lesson.max_answer ||
                    (equation[2] < 0 && !lesson.allow_negatives)) {
                    unacceptable++;
                }
            }
            expect(unacceptable).toEqual(0);
        });

        it('covers all permutations with permutations()', function () {
            var lesson = {
                    format_answer_first: 1,
                    min_quotient: 1,
                    max_quotient: 3,
                    min_divisor: 1,
                    max_divisor: 3,
                    choice_count: 4,
                    max_answer: 144,
                    allow_negatives: false
                },
                generator = problemGenerator(lesson),
                permutations = generator.permutations(),
                expectedPermutations = [],
                i, k, dividend;

            // Generate all permutations, and verify they're in permutations
            for (i = lesson.min_quotient; i < lesson.max_quotient; i++) {
                for (k = lesson.min_divisor; k < lesson.max_divisor; k++) {
                    dividend = i * k;
                    // Equation limits check
                    if (i < lesson.max_answer && (i>= 0 || lesson.allow_negatives)) {
                        expectedPermutations.push([dividend, k, i]);
                    }
                }
            }

            // Verify we have at least the correct number of permutations
            expect(permutations.length).toEqual(expectedPermutations.length);

            // Cast all the generated permutations to strings
            for (i = 0; i < permutations.length; i++) {
                permutations[i] = permutations[i].toString();
            }

            // verify all the expected permutations exist in the generated permutations
            for (i = 0; i < expectedPermutations.length; i++) {
                expect(permutations.indexOf(expectedPermutations[i].toString())).toBeGreaterThan(-1);
            }
        });
    });
});
