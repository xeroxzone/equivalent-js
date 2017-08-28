"use strict";

/**
 * @class test manager module
 */
DIC.define('EquivalentJs.test.ManagerTest', new function () {
    /**
     * @type {string}
     */
    var moduleAutoloadPath = '/equivalent-js/web/js/lib/equivalent';

    /**
     * @description test has pre setted type string
     * @memberOf EquivalentJs.test.ManagerTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager} moduleClass
     */
    this.testHasPreSettedType = function (assert, moduleClass) {
        assert.ok(
            typeof moduleClass.type === 'string',
            'pre setted type is string'
        );

        assert.ok(
            'EquivalentJs.Manager' === moduleClass.type,
            'is EquivalentJs.Manager'
        );
    };

    /**
     * @description test has and get not existing module fail
     * @memberOf EquivalentJs.test.ManagerTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager} moduleClass
     */
    this.testNotExistingModuleFail = function (assert, moduleClass) {
        var manager = moduleClass;

        manager.construct(moduleAutoloadPath, true);

        assert.ok(
            false === manager.has('EquivalentJs.NotExistingModule'),
            'has not existing module fails'
        );

        assert.ok(
            null === manager.get('EquivalentJs.NotExistingModule'),
            'get not existing module fails'
        );
    };

    /**
     * @description test remove not existing module fail
     * @memberOf EquivalentJs.test.ManagerTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager} moduleClass
     */
    this.testRemoveNotExistingModuleFail = function (assert, moduleClass) {
        var manager = moduleClass;

        manager.construct(moduleAutoloadPath, true);

        assert.ok(
            false === manager.remove('EquivalentJs.NotExistingModule'),
            'remove not existing module fails'
        );
    };

    /**
     * @description test has and get existing module success
     * @memberOf EquivalentJs.test.ManagerTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager} moduleClass
     */
    this.testExistingModuleSuccess = function (assert, moduleClass) {
        var assertAsync = assert.async(),
            manager = moduleClass;

        manager.construct(moduleAutoloadPath, true);

        manager.add('EquivalentJs.mock.ExistingModule').done(function (module) {
            assert.ok(
                true === manager.has(module.type),
                'add and has existing module'
            );

            assert.ok(
                module === manager.get(module.type).class,
                'get existing module'
            );

            module
                .setFooFirst('bar')
                .setFooSecond('bar')
                .setFooThird('bar')
                .setFooFourth('bar')
                .setFooFifth('bar')
            ;

            var expect = {
                first: 'bar',
                second: 'bar',
                third: 'bar',
                fourth: 'bar',
                fifth: 'bar'
            };

            assert.ok(
                JSON.stringify(expect) === JSON.stringify(module.getFoo()),
                'set property of existing module class'
            );

            assertAsync();
        });
    };

    /**
     * @description test ready existing module success
     * @memberOf EquivalentJs.test.ManagerTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager} moduleClass
     */
    this.testReadyExistingModuleSuccess = function (assert, moduleClass) {
        var assertAsync = assert.async(),
            manager = moduleClass;

        manager.construct(moduleAutoloadPath, true);

        manager.ready('EquivalentJs.mock.ExistingModule', function (module) {
            assert.ok(
                true === manager.has(module.type),
                'ready existing module'
            );

            assertAsync();
        });

        manager.add('EquivalentJs.mock.ExistingModule');
    };

    /**
     * @description test remove existing module success
     * @memberOf EquivalentJs.test.ManagerTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager} moduleClass
     */
    this.testRemoveExistingModuleSuccess = function (assert, moduleClass) {
        var assertAsync = assert.async(),
            manager = moduleClass;

        manager.construct(moduleAutoloadPath, true);

        manager.add('EquivalentJs.mock.ExistingModule').done(function (module) {
            assert.ok(
                true === manager.remove(module.type),
                'add and remove existing module'
            );

            assertAsync();
        });
    };

    /**
     * @description teardown the created test method objects
     * @memberOf EquivalentJs.test.ManagerTest
     */
    this.teardown = function () {
        removeModuleDOM('EquivalentJs.mock.ExistingModule');
    };

    /**
     * @description remove a test mock created namespace
     * @memberOf EquivalentJs.test.ManagerTest
     * @param {string} type
     * @return {boolean}
     */
    var removeModuleDOM = function(type) {
        var classScope = window,
            classPath = type.split('.'),
            success = false;

        $(classPath).each(function (i, className) {
            if (null !== classScope && className in classScope) {
                if (classPath.length - 1 === i) {
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
