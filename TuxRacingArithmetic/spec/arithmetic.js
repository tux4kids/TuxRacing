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
require(["arithmetic", "json!master.json"], function (arithmetic, lessonMaster) {
    describe('Arithmetic main file', function () {
        it('properly exposes the lesson master through getLessons', function () {
            var lessons = window.arithmetic.getLessons(),
                i;

            expect(lessons.length).toEqual(lessonMaster.length);

            for (i = 0; i < lessons.length; i++) {
                expect(lessons[i].title).toEqual(lessonMaster[i].title);
                expect(lessons[i].path).toEqual(lessonMaster[i].path);
                expect(lessons[i].id).toEqual(lessonMaster[i].id);
            }
        });
    });
});
