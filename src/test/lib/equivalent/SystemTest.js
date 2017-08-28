"use strict";

/**
 * @class test system module
 */
DIC.define('EquivalentJs.test.SystemTest', new function () {
    /**
     * @description test has pre setted type string
     * @memberOf EquivalentJs.test.SystemTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.System} moduleClass
     */
    this.testHasPreSettedType = function (assert, moduleClass) {
        assert.ok(
            typeof moduleClass.type === 'string',
            'pre setted type is string'
        );

        assert.ok(
            'EquivalentJs.System' === moduleClass.type,
            'is EquivalentJs.System'
        );
    };

    /**
     * @description test get namespace module string
     * @memberOf EquivalentJs.test.SystemTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.System} moduleClass
     */
    this.testGetNamespace = function (assert, moduleClass) {
        assert.ok(
            ('System' === moduleClass.getNamespace(moduleClass.type)),
            'get namespace is "System"'
        );
    };

    /**
     * @description test system module loaded manager
     * @memberOf EquivalentJs.test.SystemTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.System} moduleClass
     */
    this.testHasLoadedConfig = function (assert, moduleClass) {
        var assertAsync = assert.async();

        moduleClass.construct(true, function () {
            var configuration = moduleClass.getConfiguration();

            assert.ok(typeof configuration === 'object', 'configuration is loaded');

            assertAsync();
        });
    };

    /**
     * @description test to define a new module class with wrong parameter or class object type
     * @memberOf EquivalentJs.test.SystemTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.System} moduleClass
     */
    this.testDefineModuleClassWithWrongParameterType = function (assert, moduleClass) {
        var assertAsync = assert.async();

        moduleClass.construct(true, function () {
            assert.throws(
                function() {
                    EquivalentJs.define(1);
                },
                new Error('The module class type must be of type <string>.'),
                'exception was thrown on wrong typed module creation'
            );

            assert.throws(
                function() {
                    EquivalentJs.define(1, 1);
                },
                new Error('The module class type must be of type <string>.'),
                'exception was thrown on wrong typed module creation ' +
                'with wrong typed expected class object'
            );

            assertAsync();
        });
    };

    /**
     * @description test to define a new module class with correct parameter and wrong class object type
     *  but no class object is given
     * @memberOf EquivalentJs.test.SystemTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.System} moduleClass
     */
    this.testDefineModuleClassWithCorrectParameterTypeButNoClassObject = function (assert, moduleClass) {
        var assertAsync = assert.async();

        moduleClass.construct(true, function () {
            assert.throws(
                function() {
                    EquivalentJs.define('EquivalentJs.mock.ModuleClassNamespace');
                },
                new Error('The module class must be of type <Object>.'),
                'exception was thrown on correct typed module creation ' +
                'without class object'
            );

            assert.throws(
                function() {
                    EquivalentJs.define('EquivalentJs.mock.ModuleClassNamespace', 1);
                },
                new Error('The module class must be of type <Object>.'),
                'exception was thrown on correct typed module creation with ' +
                'wrong typed expected class object'
            );

            assertAsync();
        });
    };

    /**
     * @description test to define a new module class with correct parameter and correct class object type
     *  but no class object is given
     * @memberOf EquivalentJs.test.SystemTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.System} moduleClass
     */
    this.testDefineModuleClassWithCorrectParameterTypeAndClassObject = function (assert, moduleClass) {
        var assertAsync = assert.async();

        moduleClass.construct(true, function () {
            EquivalentJs.define('EquivalentJs.mock.ModuleClassNamespace', new function () {});

            var MockModuleClassNamespace = EquivalentJs.mock.ModuleClassNamespace;

            assert.ok(
                typeof MockModuleClassNamespace === 'object',
                'created a module class object namespace'
            );

            assertAsync();
        });
    };

    /**
     * @description teardown the created test method objects
     * @memberOf EquivalentJs.test.SystemTest
     */
    this.teardown = function () {
        removeModuleDOM('EquivalentJs.mock.ModuleClassNamespace');
    };

    /**
     * @description remove a test mock created namespace
     * @memberOf EquivalentJs.test.SystemTest
     * @param {string} type
     * @return {boolean}
     */
    var removeModuleDOM = function(type) {
        var classScope = window,
            classPath = type.split('.'),
            success = false;

        $(classPath).each(function (i, className) {
            if (null !== classScope && className in classScope) {
                if (1 === Object.keys(classScope[className]).length &&
                    classPath.length - 2 === i
                ) {
                    delete classScope[className];
                    success = true;
                } else if (classPath.length - 1 === i) {
                    delete classScope[className];
                    success = true;
                } else {
                    classScope = classScope[className];
                }
            } else {
                classScope = null;
            }
        });

        return success;
    };
});
