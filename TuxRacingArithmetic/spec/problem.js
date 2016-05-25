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
require(["problem"], function (problem) {
    describe('General arithmetic problem', function () {
        var testChoices = [],
            testQuestion = {},
            testProblem = problem(testQuestion, testChoices);

        it('Question reference retrieval successful', function () {
            expect(testProblem.question).toBe(testQuestion);
        });

        it('Choices reference retrieval successful', function () {
            expect(testProblem.choices).toBe(testChoices);
        });
    });
});
