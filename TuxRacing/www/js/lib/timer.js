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
define(function () {
    // Timer class provides a simple interface for running a basic count down.
    function Timer(seconds) {
        this.seconds = seconds;
    }

    /**
     * Start the count down clock, set up callbacks
     *
     * @return {*}
     */
    Timer.prototype.start = function () {
        this.start = +new Date();
        var that = this;
        (function timeCheck() {
            if (that.remaining(false) === 0 && that.completionFunc) {
                that.completionFunc();
            } else {
                that.progressFunc(that);
                window.setTimeout(timeCheck, that.interval);
            }
        })();
        return this;
    };

    /**
     * Returns the remaining time, either as the remaining sections or the percent
     * of remaining seconds.
     *
     * @param fraction
     * @return {Number}
     */
    Timer.prototype.remaining = function (fraction) {
        var remainingSeconds = Math.max(this.seconds - (+new Date() - this.start || 0) / 1000, 0);
        return fraction ? remainingSeconds / this.seconds : remainingSeconds;
    };

    /**
     * Listen for timer ticks every checkInterval. Calls progressFunc along the
     * way, and completionFunc after the timer is out. Be sure to call this before
     * calling start, interval listeners need to be setup before count down starts.
     *
     * @param checkInterval
     * @param progressFunc
     * @param completionFunc
     * @return {*}
     */
    Timer.prototype.interval = function (checkInterval, progressFunc, completionFunc) {
        this.interval = checkInterval;
        this.progressFunc = progressFunc;
        this.completionFunc = completionFunc;
        return this;
    };

    return {
        timer: Timer
    };
});