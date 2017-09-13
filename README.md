# EquivalentJS

## Class autoload and dependency manager

A JavaScript micro framework for modern web browsers to asynchronous autoload 
module classes and their dependencies handled by a manager for a dependency injection container.

Modules in this case are class definitions per file. All modules including all core modules of the 
framework self based on the same class interface, can be found in the generated documentation.

These modules represented by a constructor function as a class object. They can use 
dependency injection methods and listen to asynchronously autoloads 
by event or promise pattern.

They can switch on to use layout files from [Sass][sass] generated as a 
module class bound autoloaded stylesheet.

Module classes are build in a namespace struture that can be used for 
everything what the power of JavaScript can do.

Initialization of module classes can be done via a HTML attribute or by 
another JavaScript that calls the module manager.

A module test runner based on [QUnit][qunit] and isolated test methods are available.

Also a documentation runner that based on [JSDoc][jsdoc]; view the doc tag interpretation 
in time at coding, with help of file watchers from [Gulp][gulp].

This framework use [jQuery][jquery] to realize tasks in traversing, manipulation, events and ajax. 

Content

* [Module Manager][MM](docs/MODULE_MANAGER.md)
* [Test Runner][MTR](docs/TEST_RUNNER.md)
* [Doc Runner][MDR](docs/DOC_RUNNER.md)

## Requirements

Install dependencies with [npmjs][npmjs] at project root folder

    npm install

## Documentation, scripts and stylesheets

Generate scripts and stylesheets ([Sass][sass]) 
and documentation ([JSDoc][jsdoc] & [JSDoc Type][jsdoc-type])

    npm run dev:run

or

    npm run dev:watch

## Run demo application in browser

    npm run dev:http

## Build all EquivalentJS modules as concatenated minified library file

    npm run prod:minify

## Appendix

[Code of Conduct](CODE_OF_CONDUCT.md)

...live long and prosper

[MM]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/MODULE_MANAGER.md
[MTR]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/TEST_RUNNER.md
[MDR]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/DOC_RUNNER.md
[meinauto-js]: https://github.com/meinauto/meinauto-js
[npmjs]: https://www.npmjs.com
[gulp]: http://gulpjs.com
[jquery]: https://jquery.com
[qunit]: https://qunitjs.com
[jsdoc]: http://usejsdoc.org
[jsdoc-type]: http://usejsdoc.org/tags-type.html
[sass]: http://sass-lang.com
