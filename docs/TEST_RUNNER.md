# The Test Runner

The Test Runner will try to run tests for all modules stored in DIC

## The Module Test Autoload Declaration

For an example there is a [test template][test-template](../src/test/lib/equivalent/template/ModuleNameTest.js.template)

### Automated unit testing for modules with [QUnit][qunit]

    load system with get parameter "tests" like
    
    e.g.
    http://localhost:8083/?tests
    
to disable the test suit send

    e.g.
    http://localhost:8083/?tests-stop

#### Add unit test per module

    example:
    ./src/test/app/MyNamespace/MyAppTest.js

```javascript
"use strict";

/**
 * @class
 */
DIC.define('MyNamespace.test.MyAppTest', new function () {
    /**
     * @description test {@link MyNamespace.MyApp.layout} is setted
     * @memberOf MyNamespace.test.MyAppTest
     * @param {EquivalentJs.test.Unit.assert} assert the assertion interface
     * @param {MyNamespace.MyApp} moduleClass the process isolated module class
     */
    this.testHasLayout = function (assert, moduleClass) {
        assert.ok(moduleClass.layout, "has layout");
    };
});
```

##### Access application module class as an isolated process

Get the app module class as an isolated process to make changes without apply to running module class in DIC

```javascript
this.testModuleClassIsolated = function (assert, moduleClass) {
    var myApp = moduleClass;
    
    assert.ok('MyNamespace.MyApp' === myApp.type, 'access module class as isolated process');
};
```

##### Access application module class from DIC

Get the app module class from DIC

```javascript
this.testModuleClassDIC = function (assert) {
    var myApp = EquivalentJs.Manager.get('MyNamespace.MyApp');
    
    assert.ok('MyNamespace.MyApp' === myApp.type, 'access module class from DIC');
};
```

##### Access application in DOM

Get the app module representation from DOM

```javascript
this.testModuleApplicationDOM = function (assert) {
    var $myApp = $('[data-application="MyNamespace.MyApp"]');
    
    assert.ok(0 < $myApp.length, 'access module class from DOM');
};
```

#### Method naming

A test method start with lowercase letters "test" like *testImplementedMethodName*

```regexp
^test.*
```

Also the test method names "setup" and "teardown" are predefined like described 
at next paragraph.

Any other method name is free to use for any cases.

#### Setup and teardown test cases

```javascript
this.setup = function () {
  // setup something at module class scope variables or other ways
};

this.teardown = function () {
    // teardown something
};
```

##### Deferred setup and teardown

```javascript
this.setup = function () {
    // it is possible to return a deferred object to 
    // delay the test case setup since something is done
    return $.Deferred(function () {
        var $defer = this;
        setTimeout(function () {
            $defer.resolve();
        }, 1024); // example for a deferred test case setup
    });
};

this.teardown = function () {
    // it is possible to return a deferred object to 
    // delay the test case teardown since something is done
    return $.Deferred(function () {
        var $defer = this;
        setTimeout(function () {
            $defer.resolve();
        }, 1024); // example for a deferred test case teardown
    });
};
```

##### Use class autoload and dependency manager as an isolated instance

For an example there is a [test template][test-template](../src/test/lib/equivalent/template/ModuleNameTest.js.template)

```javascript
/**
 * @description an optional DIC manager instance that is isolated
 *  for this test case
 * @private
 * @alias {EquivalentJs.Manager}
 * @see EquivalentJs.Manager
 */
var manager;

/**
 * @param {EquivalentJs.Manager} managerInstance the DIC manager
 *  as an isolated instance
 */
this.setup = function (managerInstance) {
    manager = managerInstance;
};
```

#### Access the manager and application markup from inner module class scope

For better test case accessibility the manager and markup from implementation can be accessed by inner module class scope.

This means that in test cases the isolated module class instance own manager property 
are overridden by an isolated test case manager instance and the markup can be overridden per test method.

The manager and markup properties are described at the 
module class interface [{EquivalentJs.Manager.Module.class}](../src/lib/equivalent/Manager/Module/class.js) 
can be found in the generated documentation.

    example:
    ./src/app/MyNamespace/BetterTestableModuleClass.js

```javascript
"use strict";

/**
 * @class
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {Object} MyNamespace.BetterTestableModuleClass
 * @constructs
 */
DIC.define('MyNamespace.BetterTestableModuleClass', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf MyNamespace.BetterTestableModuleClass
     * @private
     * @alias {MyNamespace.BetterTestableModuleClass}
     */
    var _ = this;
    
    /**
     * @description a model dependency
     * @memberOf MyNamespace.BetterTestableModuleClass
     * @private
     * @alias {MyNamespace.BetterTestableModuleClass.Dependency}
     * @see MyNamespace.BetterTestableModuleClass.Dependency
     */
    var Dependency;
    
    /**
     * @description initialize module class
     * @memberOf MyNamespace.BetterTestableModuleClass
     */
    _.construct = function () {
        _.__manager__
            .add('MyNamespace.BetterTestableModuleClass.Dependency')
            .done(function (module) {
                Dependency = module;
                
                var renderedContent = Dependency.getContent();
                
                $(_.__markup__).find('div.better-testable-dom-element').html(renderedContent);
            });
    };
});
```

At test cases use the isolated manager instance with the isolated module class instance;

All modules that added to the isolated manager instance are also isolated inside this manager.

    example:
    ./src/test/app/MyNamespace/BetterTestableModuleClassTest.js

```javascript
"use strict";

/**
 * @class
 */
DIC.define('MyNamespace.test.BetterTestableModuleClassTest', new function () {
    /**
     * @description an optional DIC manager instance that is isolated
     *  for this test case
     * @memberOf MyNamespace.test.BetterTestableModuleClassTest
     * @private
     * @alias {EquivalentJs.Manager}
     * @see EquivalentJs.Manager
     */
    var manager;
    
    /**
     * @description mocked markup for test
     * @memberOf MyNamespace.test.BetterTestableModuleClassTest
     * @private
     */
    var $mockMarkup;
    
    /**
     * @description setup the manager instance
     * @memberOf MyNamespace.test.BetterTestableModuleClassTest
     * @param {EquivalentJs.Manager} managerInstance the DIC manager
     *  as an isolated instance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
        
        $mockMarkup = $('<div/>').addClass('test-dom-mock')
            .append($('<div/>').addClass('better-testable-dom-element'))
        ;
    };
    
    /**
     * @description test {@link MyNamespace.BetterTestableModuleClass} model dependency
     * @memberOf MyNamespace.test.BetterTestableModuleClassTest
     * @param {EquivalentJs.test.Unit.assert} assert the assertion interface
     * @param {MyNamespace.BetterTestableModuleClass} moduleClass the process isolated module class
     */
    this.testHasConstructedDependency = function (assert, moduleClass) {
        var assertAsync = assert.async();
        
        // use the mocked manager instance
        manager
            .add(moduleClass.type)
            .done(function (betterTestableModuleClass) {
                
                // set the mocked markup to module class instance markup reference
                betterTestableModuleClass.__markup__ = $mockMarkup;
                
                manager.ready(
                    'MyNamespace.BetterTestableModuleClass.Dependency', 
                    function(betterTestableModuleClassModelDependency) {
                        assert.ok(
                            'MyNamespace.BetterTestableModuleClass.Dependency' === betterTestableModuleClassModelDependency.type,
                            'module class model dependency loaded'
                        );
                        
                        var $content = $(betterTestableModuleClass.__markup__)
                            .find('div.better-testable-dom-element').html();
                        
                        assert.ok(0 < $content.length, 'content found in markup');
                        
                        assertAsync();
                    })
                    .fail(function(error) {
                        assert.notOk(true, 'failed to load module class dependency with error: ' + JSON.stringify(error));
                        
                        assertAsync();
                    })
                ;
            });
    };
});
```

[test-template]: https://github.com/xeroxzone/equivalent-js/blob/master/src/test/lib/equivalent/template/ModuleNameTest.js.template
[qunit]: https://qunitjs.com
