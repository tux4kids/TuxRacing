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

// Provides general helper functions
define(["storageShim", "helper", "jquery"], function (storage) {
    var module = {};

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    module.store = storage('TR');

    module.eventSrc = function (e) {
        var arg;
        if (!e) e = window.event;
        if (e.target) {
            arg = e.target;
        } else if (e.srcElement) {
            arg = e.srcElement;
        }
        if (arg.nodeType === 3) {
            arg = arg.parentNode;
        }
        return arg;
    };

    module.display = function (page, contents) {
        $("#pageFill").html(contents);
        $("#pageFill").removeClass().addClass(page);
    };

    // Overlay hide / display functions
    module.showOverlay = function (contents) {
        $("#overlay").html(contents);
        $("#overlay").css({display: "block"});
        $("#overlay").on("click", function () {
            module.hideOverlay();
        });
    };

    module.hideOverlay = function () {
        $("#overlay").html("");
        $("#overlay").css({display: "none"});
    };

    // MBP provides a fast click handler for webkit, this provides a similar
    // interface to the fast handler and jquery's standard on handler
    if ($.browser.webkit) {
        module.clickHandler = function (elem, func) {
            new MBP.fastButton(elem, func);
        }
    } else {
        module.clickHandler = function (element, func) {
            element.on("click", func);
        };
    }

    // Simple class that converts between unit values for a specific element
    function Units(jqueryElem) {
        this.elem = jqueryElem;
        this.dummy = $("<div></div>").css({
            overflow: "hidden",
            visibility: "hidden"
        });
    }

    /**
     * Takes an input value (eg 5em, 32%) and converts that value to outputUnits
     * @param value {string} input value (eg 5em, 32%)
     * @param outputUnits {string} output unit type (eg em, px)
     * @param toString {boolean} if true, the output will be returned as a string (eg "5em"), if not it will be a number (eg 5)
     * @return {Number}
     */
    Units.prototype.convert = function (value, outputUnits, toString) {
        var isNegative, valueInPx, outputUnitInPx, outputValue;
        this.dummy.appendTo(this.elem);

        if (typeof value === "number") {
            value = value + "px";
        }

        if (!outputUnits) {
            outputUnits = "px";
        }

        isNegative = (value[0] === "-");
        if (isNegative) {
            value = value.substr(1);
        }
        
        this.dummy.width(value);
        valueInPx = this.dummy.width();
        if (isNegative) {
            valueInPx = -1 * valueInPx;
        }
        
        this.dummy.width(1 + outputUnits);
        outputUnitInPx = this.dummy.width();
        
        this.dummy.remove();

        outputValue = valueInPx / outputUnitInPx;
        if (toString) {
            outputValue = outputValue + outputUnits;
        }
        
        return outputValue;
    };

    module.Units = Units;

    // Another unit converter, simplified to convert a value only to pixels
    (function(){

        var temp = document.createElement("div");  // create temporary element
        temp.style.overflow = "hidden";  // in case baseline is set too low
        temp.style.visibility = "hidden";  // no need to show it

        // get object with units
        var pixelConverter = function(target){
            return function (value) {
                var sign = 1;
                target.parentNode.appendChild(temp);    // insert it into the parent for em and ex

                if (typeof value === "number") {
                    value = value + "px";
                }
                if (value[0] === "-") {
                    value = value.substr(1);
                    sign = -1;
                }

                temp.style.width = value;
                var answer  = temp.offsetWidth;

                target.parentNode.removeChild(temp);  // clean up

                return answer * sign;
            };
        };

        module.pixelConverter = pixelConverter;

    })();

    return module;
});
