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
// This module handles displaying question/choices and the user answer rate
define(["utilities", "jquery"], function (utilities) {
    var module = {},
        that = {},
        elem;

    // Custom events
    $.Event("lesson:answer");

    that.trigger = $(document).trigger.bind($(document));

    /**
     * Resets the module and sets up the lesson to use problems generated by the
     * passed in generator function
     *
     * @param generator
     * @return {Object}
     */
    module.start = function (generator) {
        module.elem = elem = $("#TRExercise");
        that.generator = generator;
        that.startTime = +(new Date());
        that.correct = 0;
        that.answered = 0;
        module.newProblem();

        return module;
    };

    module.onCorrect = function (callback) {
        that.correctFunc = callback;
    };

    /**
     * Returns the player's answer rate, which is the average correct problems
     * per minute multiplied by the percent correct
     *
     * @return {Number}
     */
    module.rate = function () {
        if (that.correct === 0 || that.answered === 0) {
            return 0;
        }
        return that.correct / ((+new Date() - that.startTime) / 60000) * that.correct / that.answered;
    };

    // Create a choice element with a handler set up to catch correct/incorrect answers
    // and then fire the lesson:answer event, passing along some relevant data
    function _choiceElem(choice) {
        var elem = $("<li></li>").addClass("tr_choice"),
            link = $("<a></a>").text(choice).appendTo(elem);

        if (that.problem.question.checkAnswer(choice)) {
            module.correctElem = elem;
        }

        // On an answer, figure out if the answer was correct and update the
        // correct/total answer trackers correctly. THen fire of the lesson:answer
        // event
        utilities.clickHandler(link, function () {
            var correct = (module.correctElem === elem);

            if (correct) {
                that.correct++;
            }
            that.answered++;

            if (that.correctFunc) {
                that.correctFunc({
                    elem: elem,
                    link: link,
                    choice: choice,
                    isCorrect: correct
                });
            }
        });

        return elem;
    }

    /**
     * Sets the lesson interface to use a new problem
     * @return {Object}
     */
    module.newProblem = function () {
        that.problem = that.generator();

        var choices = that.problem.choices,
            question = that.problem.question;

        // empty() prevents memory leaks innerHTML("") skips
        elem.empty();

        // Fill the lesson element with the question in an h1 and an unordered list
        // of choices.
        $("<h1></h1>").addClass("tr_question").text(question).appendTo(elem);
        var choiceList = $("<ul></ul>").addClass("tr_problemChoices");
        var m, i;
        for (i = 0; i < choices.length; i++) {
            m = _choiceElem(choices[i]);
            m.appendTo(choiceList);
        }
        choiceList.appendTo(elem);

        return module;
    };

    return module;
});