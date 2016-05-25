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
require(["utilities"], function (utilities) {
    describe('Ranged random number generator in utilities', function () {
        beforeEach(function () {
            Math.originalRandom = Math.random;
        });
        
        afterEach(function () {
            Math.random = Math.originalRandom;
        });

        it('produces a maximum value equal to the maximum in the range', function () {
            Math.random = function() {
                return 1;
            };
            expect(utilities.randomInRange(1, 9)).toEqual(9);
        });

        it('produces a minimum value equal to the minimum in the range', function () {
            Math.random = function () {
                return 0;
            };
            expect(utilities.randomInRange(1, 9)).toEqual(1);
        });
    });

    describe('Fisher-Yates algorithm in utilities', function () {
        // If the algorithm is properly shuffled, each of the source array
        // elements are equally likely to occur at a given position in the
        // shuffled array. So the average value at a given position in the
        // shuffled array should be equal to the mean of the source array.
        it('produces a uniform distribution', function () {
            // Source array to analyze shuffling over
            var source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                // Holds the sum of values for each position over all iterations
                sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                iterations = 10000,
                mean = 0,
                i, j, shuffled;

            // Find source array mean
            for (i = 0; i < source.length; i++) {
                mean += source[i];
            }
            mean = mean / source.length;

            // Build the sum of shuffled array values
            for (i = 0; i < iterations; i++) {
                shuffled = utilities.fisherYates(source);
                for (j = 0; j < shuffled.length; j++) {
                    sum[j] += shuffled[j];
                }
            }

            // Verify the value is close to expected
            //
            for (i = 0; i < sum.length; i++) {
                expect(sum[i] / iterations).toBeCloseTo(mean, 0.1)
            }
        });
    });
});
