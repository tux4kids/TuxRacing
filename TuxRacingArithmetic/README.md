TuxRacingArithmetic
===================

Basic arithmetic module for TuxRacing. Currently supports:

* Addition
* Subtraction
* Multiplication
* Division
* Problem generators can take in an object with parameters from a TuxMath lesson (see preliminary src/lessonParser.js)


[JSDoc](https://github.com/jsdoc3/jsdoc) auto-generated documentation available [here](http://www.klocatelli.name/TuxRacingArithmetic/jsdoc/) (refer to [gh-pages branch](https://github.com/klocatelli/TuxRacingArithmetic/tree/gh-pages)).


Utilizes:
* [RequireJS](http://requirejs.org/) - Dependencies/module loader
* [Jasmine](https://github.com/pivotal/jasmine) - Testing (with [jsTestDriver adapter](https://github.com/ibolmo/jasmine-jstd-adapter))
* [JsTestDriver](http://code.google.com/p/js-test-driver/) - test runner (patched version included for globbing support)
* [Jake](https://github.com/mde/jake) - Management/convenience script (requires nodejs)


Todo:
* Proper spec error checking in modules (eg throwing if no generators are enabled)
* Update all documentation and tests
