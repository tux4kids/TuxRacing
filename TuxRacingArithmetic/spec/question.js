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
require(["question"], function (question) {
    describe('question', function () {
        var testQuestion = question(
            [1, 6, 7],
            2,
            '+'
        );

        it('String value returns proper string', function () {
            expect(testQuestion.toString()).toEqual("1 + 6 = ?");
        });


        it('Checks correct answer', function () {
            expect(testQuestion.checkAnswer(7)).toEqual(true);
        });
    });
});
