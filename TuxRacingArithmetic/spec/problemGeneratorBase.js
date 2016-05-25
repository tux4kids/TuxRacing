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
require(["problemGeneratorBase"], function (problemGeneratorBase) {
    describe('problemGeneratorBase', function () {
        it('produces proper random format choice for a single format', function () {
            var generator = problemGeneratorBase({
                    format_answer_first: 0,
                    format_answer_last: 0,
                    format_answer_middle: 1
                }
            );
            expect(generator.randomFormat()).toBe(1);
        });

        it('produces proper random format choice for multiple formats', function () {
            var generator = problemGeneratorBase({
                    format_answer_first: 1,
                    format_answer_last: 0,
                    format_answer_middle: 1
                }
            );

            expect([0, 1]).toContain(generator.randomFormat());
            expect([0, 1]).toContain(generator.randomFormat());
            expect([0, 1]).toContain(generator.randomFormat());
            expect([0, 1]).toContain(generator.randomFormat());
        });

        it('produces acceptable choices count', function () {
            var generator = problemGeneratorBase({
                    format_answer_first: 1,
                    format_answer_last: 1,
                    format_answer_middle: 1
                }
            );

            expect(generator.createChoices(0, 10, 10, 4, false).length).toEqual(10);
        });

        it('produces unique choices', function () {
            var generator = problemGeneratorBase({
                        format_answer_first: 1,
                        format_answer_last: 0,
                        format_answer_middle: 1
                }),
                choices = generator.createChoices(1, 3, 3, 3, true);

            // Given the uniqueness constraint, the choices should have 1, 2, 3
            expect(choices).toContain(1);
            expect(choices).toContain(2);
            expect(choices).toContain(3);
        });

        it('creates problems properly', function () {
            var generator = problemGeneratorBase({
                    format_answer_first: 1,
                    format_answer_last: 0,
                    format_answer_middle: 0,
                    choice_count: 4
                }),
                problem, correct, i;
            generator.symbol = '+';
            generator.choiceRanges = [
                        {min: 2, max: 5}
                    ];
            generator.equationGenerator = function () {
                        return [1, 2, 3];
                    };

            problem = generator.generate();

            expect(problem.question.toString()).toEqual("? + 2 = 3");
            expect(problem.question.checkAnswer(1)).toEqual(true);

            correct = 0;
            for (i = 0; i < problem.choices.length; i++) {
                if (problem.question.checkAnswer(problem.choices[i])) {
                    correct++;
                }
            }
            expect(correct).toEqual(1);
        });

        it('properly wraps permutations in problems', function () {
            var generator = problemGeneratorBase({
                    format_answer_first: 1,
                    format_answer_last: 0,
                    format_answer_middle: 1,
                    choice_count: 4
                }),
                permutationProblems, i;
            generator.symbol = '+';
            generator.choiceRanges = [
                {min: 2, max: 9},
                {min: 2, max: 9}
            ];
            // non-sense permutations
            generator.permutations = function () {
                return [
                        [1, 2, 3],
                        [4, 5, 6]
                    ];
            };

            permutationProblems = generator.generateAll();
            // 2 permutations from the generator * 2 enabled formats
            expect(permutationProblems.length).toEqual(2 * 2);

            // Get the string representation of all the problems
            for (i = 0; i < permutationProblems.length; i++) {
                permutationProblems[i] = permutationProblems[i].question.toString();
            }

            // Verify all expected permutations are in the permutation array
            expect(permutationProblems.indexOf("1 + ? = 3")).toBeGreaterThan(-1);
            expect(permutationProblems.indexOf("4 + ? = 6")).toBeGreaterThan(-1);
            expect(permutationProblems.indexOf("? + 2 = 3")).toBeGreaterThan(-1);
            expect(permutationProblems.indexOf("? + 5 = 6")).toBeGreaterThan(-1);
        });
    });
});
