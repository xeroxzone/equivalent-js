# The Module Manager

All modules stored in a Dependency Injection Container – in following called DIC

- listen to event when module class is ready registered into DIC;
the event will be fired on manager everytime if a module class get registered.

```javascript
DIC.ready('MyNamespace.MyApp', function (module) {
    var MyApp = module;
});
```

- register a module class into DIC and receive a promise resolver

```javascript
/**
 * @param {string} type as module class name
 * @param {Object=} parameters optional object of construction parameters
 * @returns {Deferred}
 */
DIC.add('MyNamespace.MyApp', {})
    .done(function (module) {
        /**
        * @alias {MyNamespace.MyApp}
        */
        var MyApp = module;
    })
    .fail(function() {/* on module fail... */});
```

- has a module class in DIC

```javascript
if (true === DIC.has('MyNamespace.MyApp')) {}
```

- get a module class from DIC

```javascript
/**
 * @alias {MyNamespace.MyApp} MyApp
 */
var MyApp = DIC.get('MyNamespace.MyApp').class;
```

- remove a module class from DIC

```javascript
if (true === DIC.remove('MyNamespace.MyApp')) {}
```

- show DIC object or EquivalentJs public interface object in browser console

```javascript
console.log(DIC, EquivalentJs);
```

## Configuration

The [Gulp][gulp] piped input / output paths for javascripts, stylesheets and documentation to the public web folder 
can be changed by the gulp.json configuration file:

[./gulp.json](../gulp.json)

To change from which web location the module manager read the files, modify the parameters.json configuration file:

[./src/config/parameters.json](../src/config/parameters.json)

A further way is to define a global variable before load the EquivalentJS framework:

as a custom web uri to the folder containing the parameters.json file

```html
<script type="text/javascript">
    var EquivalentJSConfiguration = '/js/config';
</script>
```

or as json like in [parameters.json](../src/config/parameters.json)

```html
<script type="text/javascript">
    var EquivalentJSConfiguration = {
        "shortcut": "DIC",
        "environment": "dev",
        "appPath": "js/app",
        "modulePath": "js/lib/equivalent",
        "moduleLayout": "css",
        "docFramework": "doc",
        "testFrameworkUnit": "js/lib/qunit.js",
        "testFrameworkTheme": "css/debug.css",
        "systemTests": false
    };
</script>
```

run watcher like described in [README.md][readme](../README.md)

### Configure environment parameter

The default environment is "dev". This mode enables access to test and doc runner.

If the environment is set something else instead of "dev" the test and doc runner get not initialized.

Also the manager is trying to use concatenated preloaded in
DOM available framework module classes if the environment parameter is not "dev".

## The Module Autoload Declaration

For example there is a [module template][module-template](../src/lib/equivalent/template/ModuleName.js.template).

First initializing point of the autoloaded module class could be an application 
markup or a direct object call from another javascripts to access the module by DIC.

### Append autoloader run script to document head or body bottom

```html
<head>
    <script src="js/lib/equivalent.js"></script>
</head>
```

or

```html
<body>
    <!-- some markup... -->
    <script src="js/lib/equivalent.js"></script>
</body>
```

### Automated unit testing for modules with [QUnit][qunit]

For automated testing use the integrated test runner:

* [Test Runner][MTR](TEST_RUNNER.md)

### Automated doc generated view in browser with [JSDoc][jsdoc] and [Gulp][gulp]

For automated documentation generation for all declared modules use the integrated doc runner:

* [Doc Runner][MDR](DOC_RUNNER.md)

### Define an initializing point for an autoloaded class.

```html
<body>
    <!-- markup... -->
    <div class="hidden" data-application="MyNamespace.MyApp"></div>
    <!-- further markup... -->
</body>
```

or with construction parameters

```html
<body>
    <!-- markup... -->
    <div class="hidden" data-application="MyNamespace.MyApp" data-parameters='{"a": true}'></div>
    <!-- further markup... -->
</body>
```

### Create class file

    example:
    ./src/app/MyNamespace/MyApp.js

```javascript
"use strict";

/**
 * @class
 * @classdesc my class description here
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {Object} MyNamespace.MyApp
 * @constructs
 */
DIC.define('MyNamespace.MyApp', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf MyNamespace.MyApp
     * @private
     * @alias {MyNamespace.MyApp}
     */
    var _ = this;

    /**
     * @description initialize application
     * @memberOf MyNamespace.MyApp
     * @public
     */
    _.construct = function () {
        $(_).on('custom.event', function() {
            doSomething();
        });
    };
    
    /**
     * @description do something with class event
     * @memberOf MyNamespace.MyApp
     * @private
     */
    var doSomething = function() {
        var $myAppViewport = $('[data-application="MyNamespace.MyApp"]');
        
        $myAppViewport.removeClass('hidden');
        
        // do something
    };
});
```

### Function as first class citizen

Bind class scope to private variable to set on this public interfaces:

```javascript
/**
* @alias {MyNamespace.MyApp}
*/
var _ = this;
```

It is optional to define the autoload class method for module construction.

### Define class autoload constructor

This construct method get destroyed after module is loaded.

Describe the class autoload construction:

```javascript
/**
 * @public
 */
_.construct = function () {
    // do something
};
```

### Define autoloaded stylesheet

    ./src/app/MyNamespace/my-app.scss

```javascript
/**
 * @description bind a stylesheet on module;
 *  if true then add sass css file to the corresponding module class folder;
 *  the file name pattern is lowercase dash seperated module class name parts
 *  like MyNamespace/MyApp.js => MyNamespace/my-app.scss;
 *  the stylesheet DOM link element get removed if 
 *  the module will be removed from DIC;
 *  this property is optional
 * @type {boolean}
 * @see EquivalentJs.Manager.Module.class.__layout__ the css reference
 */
_.layout = true;
```

### Define class events

Bind custom events to class scope

```javascript
/**
 * @public
 */
_.construct = function () {
    $(_).on('custom:event', function() {
        doSomething();
    });
};

/**
 * @event MyNamespace.MyApp#custom:event
 * @private
 */
var doSomething = function() {
    var $myAppViewport = $('[data-application="MyNamespace.MyApp"]');
    // do something
};
```

Trigger custom events at outside the class scope;

e.g.

```javascript
/**
 * @fires MyNamespace.MyApp#custom:event
 */
console.log(
    $(MyNamespace.MyApp).trigger('custom:event', {})
);
```

### Define autoload dependency classes

    example:
    ./src/app/MyNamespace/MyApp/controller/Doing.js
    ./src/app/MyNamespace/MyApp/model/Data.js
    ./src/app/MyNamespace/MyApp/view/Page.js

```javascript
/**
 * init
 */
_.construct = function () {
    DIC.add([
        'MyNamespace.MyApp.controller.Doing',
        'MyNamespace.MyApp.model.Data',
        'MyNamespace.MyApp.view.Page'
    ]).done(function () {
        $(_).trigger('custom:event', {});
    });
    
    $(_).on('custom:event', function(event, parameters) {
        doSomething(parameters);
    });
};

/**
 * do something by class event
 * @param {Object} parameters
 */
var doSomething = function(parameters) {
  /** @alias {MyNamespace.MyApp.controller.Doing} */
  var controller = DIC.get('MyNamespace.MyApp.controller.Doing').class;
  
  /** @alias {MyNamespace.MyApp.model.Data} */
  var model = DIC.get('MyNamespace.MyApp.model.Data').class;
  
  /** @alias {MyNamespace.MyApp.view.Page} */
  var view = DIC.get('MyNamespace.MyApp.view.Page').class;
};
```

## Extend classes with object inheritance

### Define an abstract class

    example:
    ./src/app/MyNamespace/MyApp/abstract/Controller.js

```javascript
"use strict";

/**
 * @class
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {Object} MyNamespace.MyApp.abstract.Controller
 * @constructs
 */
DIC.define('MyNamespace.MyApp.abstract.Controller', new function () {
    /**
     * @alias {MyApp.abstract.Controller}
     */
    var _ = this;
    
    /**
     * @type {number}
     */
    _.aProperty = 1;
    
    /**
     * @type {number}
     */
    _.bProperty = 1;
    
    /**
     * @return {boolean}
     */
    _.aMethod = function () {
        return true;
    };
    
    /**
     * init
     */
    _.construct = function () {
        // do something parent
    };
});
```

### Define an inherited class

    example:
    ./src/app/MyNamespace/MyApp/controller/Doing.js

```javascript
"use strict";

/**
 * @class
 * @implements {EquivalentJs.Manager.Module.class}
 * @augments {MyNamespace.MyApp.abstract.Controller}
 * @typedef {Object} MyNamespace.MyApp.controller.Doing
 * @constructs
 */
DIC.define('MyNamespace.MyApp.controller.Doing', new function () {
    /**
     * @alias {MyApp.controller.Doing}
     */
    var _ = this;
    
    /**
     * @type {string}
     */
    _.extend = 'MyNamespace.MyApp.abstract.Controller';

    /**
     * @type {number}
     */
    _.bProperty = 2;
    
    /**
     * init
     */
    _.construct = function () {
        // do something inherit
    };
});
```

Results as a class that inherits all public properties and methods from the abstract class.

The inherited class is instantiated into the DIC, the abstract class is not instantiated.

If the parent class has a construct method it will call first the parent constructor.

At least the inherit constructor is called.

If an inherited public property / method is set, it doesn't set the parent public property / method.

```javascript
DIC.get('MyNamespace.MyApp.controller.Doing').class;
```

```
{
    type: 'MyNamespace.MyApp.controller.Doing',
    extend: 'MyNamespace.MyApp.abstract.Controller',
    aProperty: 1,
    bProperty: 2,
    aMethod: function () {return true;}
}
```

[MTR]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/TEST_RUNNER.md
[MDR]: https://github.com/xeroxzone/equivalent-js/blob/master/docs/DOC_RUNNER.md
[module-template]: https://github.com/xeroxzone/equivalent-js/blob/master/src/lib/equivalent/template/ModuleName.js.template
[gulp]: http://gulpjs.com
[qunit]: https://qunitjs.com
[jsdoc]: http://usejsdoc.org
