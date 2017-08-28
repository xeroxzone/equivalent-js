"use strict";

/**
 * @class test manager extend module
 */
DIC.define('EquivalentJs.test.Manager.ExtendTest', new function () {
    /**
     * @description the manager mock
     * @memberOf EquivalentJs.test.Manager.ExtendTest
     * @type {EquivalentJs.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf EquivalentJs.test.Manager.ExtendTest
     * @param {EquivalentJs.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test has assigned module class type by manager
     * @memberOf EquivalentJs.test.Manager.ExtendTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager.Extend} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJs.Manager.Extend' === moduleClass.type,
            'is EquivalentJs.Manager.Extend'
        );
    };

    /**
     * @description test use inherit method with wrong parameters
     * @memberOf EquivalentJs.test.Manager.ExtendTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager.Extend} moduleClass
     */
    this.testExtendWithWrongParameters = function (assert, moduleClass) {
        var errorMessage = 'Could not extend module! Expected two <Object>\'s as module class to extend.';

        assert.throws(
            function () {
                moduleClass.inherit(1);
            },
            new Error(errorMessage),
            'inherit with wrong count of parameters fails'
        );

        assert.throws(
            function () {
                moduleClass.inherit(1, 1);
            },
            new Error(errorMessage),
            'inherit with wrong parameter types fails'
        );

        assert.throws(
            function () {
                moduleClass.inherit(new function () {});
            },
            new Error(errorMessage),
            'inherit with only an inherit class object but no parent class object fails'
        );

        assert.throws(
            function () {
                moduleClass.inherit(new function () {}, 1);
            },
            new Error(errorMessage),
            'inherit with only an inherit class object but parent class object of wrong type fails'
        );
    };

    /**
     * @description test use inherit method with correct parameters
     * @memberOf EquivalentJs.test.Manager.ExtendTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager.Extend} moduleClass
     */
    this.testExtendWithCorrectParameters = function (assert, moduleClass) {
        var parentClass = new function () {
            this.a = 1;

            this.b = 1;
        };

        var inheritClass = new function () {
            this.b = 2;
        };

        var inheritedClass = moduleClass.inherit(inheritClass, parentClass);

        assert.ok(typeof inheritedClass === 'object', 'inherit of parent class as valid class object');

        assert.ok(1 === inheritedClass.a, 'inherited property of parent class object is setted');

        assert.ok(2 === inheritedClass.b, 'not parent property is setted at inherited property');
    };

    /**
     * @description test extend a module by another with manager
     * @memberOf EquivalentJs.test.Manager.ExtendTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager.Extend} moduleClass
     */
    this.testExtendModuleByAnotherWithManager = function (assert, moduleClass) {
        var assertAsync = assert.async();

        manager.add(moduleClass.type).done(function () {
            manager.add('EquivalentJs.mock.InheritModule').done(function (module) {
                assert.ok('EquivalentJs.mock.InheritModule' === module.type, 'test inherit module type');

                assert.ok('EquivalentJs.mock.AbstractModule' === module.extend, 'test inherit module extend type');

                assert.ok(1 === module.aProperty, 'test abstract property is in inherited class');

                assertAsync();

                manager.remove('EquivalentJs.mock.InheritModule');
            });
        });
    };
});
