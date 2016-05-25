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
/*
This class simply provides two vector functions, only one of which is actually
used by the DOM-based engine. It's mostly a placeholder for the canvas engine,
which uses a lot more vector math.
 */
define({
    /**
     * Adds an input vector to another after scaling by a constant. Think of
     * updating position by scaling velocity by time then adding. position
     * vector is updated in-place
     *
     * @param position
     * @param velocity
     * @param time
     * @return {*}
     */
    addScaledVector: function (position, velocity, time) {
        position[0] += velocity[0] * time;
        position[1] += velocity[1] * time;
        return position;
    },
    /**
     * Identical to addScaledVector, except creates a copy rather than modifying
     * in-place
     *
     * @param position
     * @param velocity
     * @param time
     * @return {Array}
     */
    // addVelocity, but modifies a copy rather than modifying position in-place
    addScaledVectorCopy: function (position, velocity, time) {
        return [position[0] + velocity[0] * time,
                position[1] + velocity[1] * time];
    }
});