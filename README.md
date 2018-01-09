# <img src="https://raw.githubusercontent.com/xeroxzone/equivalent-js/master/web/icon/favicon-32x32.png" alt="EquivalentJS"> EquivalentJS

## Class autoload and dependency manager

A JavaScript micro framework for modern web browsers to asynchronous autoload 
module classes and their dependencies handled by a manager for a dependency injection container.

Modules in this case are class definitions per file. All modules including all core modules of the 
framework self based on the same class interface, can be found in the generated documentation.

These modules represented by a constructor function as a class object. They can use 
dependency injection methods and listen to asynchronously autoloads 
by event or promise pattern.

They can switch on to use layout files from [Sass][sass] generated or
templates with [Twig][twigjs] as a module class bound autoloaded resource.

Module classes are build in a namespace structure that can be used for 
everything what the power of JavaScript can do.

Initialization of module classes can be done via a HTML attribute or by 
another JavaScript that calls the module manager.

A module test runner based on [QUnit][qunit] and isolated test methods are available.

Also a documentation runner that based on [JSDoc][jsdoc]; view the doc tag interpretation 
in time at coding, with help of file watchers from [Gulp][gulp].

This framework use [jQuery][jquery] to realize tasks in traversing, manipulation, events and ajax. 

Content

* [Module Manager][MM](docs/MODULE_MANAGER.md)
* [Module Plugin][MP](docs/MODULE_PLUGIN.md)
* [Test Runner][MTR](docs/TEST_RUNNER.md)
* [Doc Runner][MDR](docs/DOC_RUNNER.md)

## Requirements

Install dependencies with [npmjs][npmjs] at project root folder

    npm install

## Documentation, scripts, stylesheets and templates

Generate scripts, stylesheets ([Sass][sass]) and templates ([Twig][twigjs]) 
and documentation ([JSDoc][jsdoc] & [JSDoc Type][jsdoc-type])

    npm run dev:run

or

    npm run dev:watch

## Run demo application in browser

    npm run dev:http
    
    http://127.0.0.1:8083/index.html

## Build all EquivalentJS modules as concatenated minified library file

    npm run prod:minify
    
    http://127.0.0.1:8083/prod.html

## How to contribute

[Contributing](CONTRIBUTING.md)

## Appendix

[Code of Conduct](CODE_OF_CONDUCT.md)

Latest stable version:
[![npm version](https://badge.fury.io/js/equivalent-js.svg)](https://badge.fury.io/js/equivalent-js)

Quality measurement:
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1f414132646b405a8d167ed2a84d1b5d)](https://www.codacy.com/app/xeroxzone/equivalent-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xeroxzone/equivalent-js&amp;utm_campaign=Badge_Grade)

...live long and prosper


[MM]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/MODULE_MANAGER.md
[MP]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/MODULE_PLUGIN.md
[MTR]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/TEST_RUNNER.md
[MDR]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/DOC_RUNNER.md
[npmjs]: https://www.npmjs.com
[gulp]: http://gulpjs.com
[jquery]: https://jquery.com
[qunit]: https://qunitjs.com
[jsdoc]: http://usejsdoc.org
[jsdoc-type]: http://usejsdoc.org/tags-type.html
[sass]: http://sass-lang.com
[twigjs]: https://github.com/twigjs/twig.js/wiki
