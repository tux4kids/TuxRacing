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
define(["./vector"], function (vector) {
    /**
     * Constructs a ship object. Basically just an image element with some
     * associated vectors for position/velocity, and step/render methods
     *
     * @param scene
     * @param image
     * @constructor
     */
    function Ship(scene, image) {
        this.elem = $(image).clone().addClass("TRObject TRImage TRShip");
        this.pos = [0, 0];
        this.vel = [0, 0];
        scene.attach(this);
    }

    /**
     * Step the ship forward by ds seconds
     *
     * @param ds
     * @return {*}
     */
    Ship.prototype.step = function (ds) {
        vector.addScaledVector(this.pos, this.vel, ds);

        return this;
    };

    /**
     * Move the ship to the current relative position
     */
    Ship.prototype.render = function () {
        this.elem.css({
            top: this.pos[1] + "%",
            left: this.pos[0] + "%"
        });
    };
    return Ship;
});