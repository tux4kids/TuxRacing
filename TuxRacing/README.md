Readme
=============
---------------------------------------

TuxRacing is a [Tux4Kids](http://tux4kids.alioth.debian.org/) project, started as part of the the 2012 Google Summer of Code. It is a kids game for practicing problems, available as a packaged app for Android and iOS (soon) smartphones as well as through any modern web browser.


0 - Table of contents
-------------

1. Overview
2. Game Play
3. Installation
4. Development
 1. Architecture
 2. Languages
 3. Modules
 4. Exercises
 5. Problems
 6. Dependencies
 7. Software Used
6. Future

1 - Overview
-------------

TuxRacing is a horizontally-scrolling racing game. You solve problems to provide energy to your ship, and compete against NPC ships to finish in 1st. The types of problems change based on the subject, and different subject modules can be added without modifying the game.

2 - Game play
-------------

Very intuitive, press Play and then press the icon for the module you want to play. Then select an exercise from the displayed list. After selecting, the game immediately starts. Solve the questions as fast as possible by clicking the correct answer box. Correct and incorrect answers are highlighted for a short time to encourage learning from mistakes. Two meters are displayed at the top left of the game when a race is in progress. The orange left meter displays the remaining time in the race, and the right meter displays the player ship's energy levels. The energy meter is tied to the speed at which the player solves problems, and the lower it goes the slower the ship travels. The objective is to be in 1st place by the end of the game to collect 3 stars for the exercise (2 and 1 star for 2nd and 3rd place, respectively).

Currently the player ship defaults to blue and the NPC ships default to neon-green.

3 - Installation
-------------
Browser to http://www.klocatelli.name/TuxRacing for the web-based version. Official app store links will be added here when they are published.

Please read INSTALL.txt for more detailed installation instructions.

4 - Development
-------------

**4.1 - Architecture**

The application is contained within the `www/` folder, and running `volo appcache` builds the optimized version in `www-built/`. Image resources are in `img/`, style sheets are written in LESS and stored in `less`, the heart of the application is JavaScript stored in `js`.

Volo is used to simplify building. The main commands are `volo appcache` and `volo less`, always run from the root directory (where the volofile file is).

This project uses [RequireJS](http://requirejs.org) for dependency management/organization. The entry point is `js/app/main.js`. The game is a single-page application using fragment URIs for navigation (via `js/lib/router.js`, which wraps [Crossroads.js](http://millermedeiros.github.com/crossroads.js/) + [Hasher](https://github.com/millermedeiros/hasher/)).

Every page in the application is stored as a folder in `js/app/pages`, which has at least one JavaScript file for logic and gets required in `js/app/main.js`. This file does set up like listening for the fragment URIs the page responds to (eg #/index). The folder also contains `nls/` and `tpl/` folders. The former contains translation strings for the application (see 4.2), the latter contains [HTML micro-templates](http://ejohn.org/blog/javascript-micro-templating/). Pages are rendered and the resulting HTML put in the #pageFill div with a custom class for every page for styling purposes.

To throw an error, include the error page module and call the display method with the appropriate arguments.

See the module section for details on the module architecture. `js/app/lib/TR.js` glues together the modules and application.

[LESS](http://lesscss.org/) is used to keep the project easy to get started with. Edit styles in `less/` and run `volo less` in the project root to regenerate CSS.

**4.2 - Languages**

TuxRacing supports multiple languages, but currently only English translation strings are available. Translations are handled in the following fashion:

- Module includes a module in an `nls/` folder
- The module defines the global translation strings, enables more specific strings
- Specific strings are stored in a folder named after their locale, with a file name identical to the root (eg `nls/fr-FR/index.js`)
- When the game is loaded, strings are loaded and more specific locales overwrite their parents.
 - The locale is automatically selected from the system setting for Android, and progressively picks from the browser, user, and system languages for other platforms (not all are necessarily available).

The code using the strings simply references the translation string label. See `js/app/pages/index/` for an example of how locales are used (a fake en-fk locale is provided).

**4.3 - Modules**

Modules are used for storing a set of exercises. Every module has the following pattern, which can be implemented any way desired:

- All modules have a refname/shortname, can be any primitive and serves as a unique identifier for the module.
- When the module is ready for use, it calls TR.moduleLoaded.dispatch(refname, moduleObject), which alerts the application to the new module.
- Module objects must support the following methods:
 - description(): [Deprecating] String description of the problem module
 - name(): String title of the problem module (eg "Arithmetic")
 - ref(): Returns the module refname/shortname
 - iconPath(): Returns a string URL for the module's icon
 - exercises(): Returns an array of objects, each object has title and id values. Title is the string title of the lesson, id is a unique identifier passed to exercise()
 - exercise(id, callback): Load the specific exercise for the module and fire the callback on completion (passing in the exercise object); allows for synchronous and asynchronous loading
 - supportsLocale(): returns a boolean indicating whether or not the module supports the currently selected local (determined via TR.js)

A reference arithmetic module is available at https://github.com/klocatelli/TuxRacingArithmetic

**4.4 - Exercises**

Exercises provide problems to solve. Every exercise has the following specification:

- targetRates(): Returns a two-element array containing problem solving rates for 1st and 2nd place in problems per minute. Order doesn't matter.
- bgConstants(): Returns an object with keys c1 and c2. These are plugged into the equation c1 * raw problem solving rate + c2 to get the ship velocity (number of times per second the ship moves the width of the screen)
- maximumRate(): Returns a number representing the "maximum" problem solving rate in problems per minute. This is just used for calculating the percent width of the energy bar, player rates can exceed this.
- duration(): Length of the exercise in seconds
- generate(): Returns a problem object

**4.5 - Problems**

Problems are precisely what they sound like, a question with several possible choices. They follow this specification:

- choices: An array of possible choices
- question: Object with toString method which returns the string representation of the problem and checkAnswer method that validates the selected choice

**4.6 - Dependencies**

Running: A web browser.

Developing: [volo](https://github.com/volojs/volo) (which requires [Node.js](http://nodejs.org/)); to run build scripts.

**4.7 - Software Used**

In no particular order, these software/frameworks/bundles were used/augmented in building TuxRacing:

- [jQuery](http://jquery.com/)
- [PhoneGap](http://phonegap.com/)
- [320andup](http://stuffandnonsense.co.uk/projects/320andup/)
- [RequireJS](http://requirejs.org)
 - [RequireJS-tpl](https://github.com/ZeeAgency/requirejs-tpl)
 - [RequireJS-i18n](https://github.com/requirejs/i18n)
- [HTML5 responsive template](https://github.com/dmose/html5-game-template)
- [Crossroads.js](http://millermedeiros.github.com/crossroads.js/) + [Hasher](https://github.com/millermedeiros/hasher/)

6 - Future
-------------
Future additions:

- Finish faster HTML5 canvas engine: DOM is limited and awkward, build a fast canvas engine to (re)-add  asteroids, parallax star background, lasers, effects (trailing exhaust), animated graphical finishing screen, etc.
- Customizable ships: Type of ship, coloring, etc.
- Star store: Purchase add-ons with stars (see customization, above).
- Automatic difficulty scaling.
- Server back-end for tracking student progress.
- PvP multiplayer.
