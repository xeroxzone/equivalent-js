"use strict";

/**
 * @class test factory model
 */
DIC.define('DemoApp.test.Factory.CircleTest', new function () {
    /**
     * @description the manager mock
     * @memberOf DemoApp.test.Factory.CircleTest
     * @alias {EquivalentJS.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf DemoApp.test.Factory.CircleTest
     * @param {EquivalentJS.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test has assigned module class type by manager
     * @memberOf DemoApp.test.Factory.CircleTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.Factory.Circle} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'DemoApp.Factory.Circle' === moduleClass.type,
            'is DemoApp.Factory.Circle'
        );
    };

    /**
     * @description test set or get model without create
     * @memberOf DemoApp.test.Factory.CircleTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.Factory.Circle} moduleClass
     */
    this.testSetOrGetModelWithoutCreate = function (assert, moduleClass) {
        assert.throws(
            function() {
                moduleClass.setSize('1rem');
            },
            new Error('Firstly use the create method!'),
            'exception was thrown on set model before create'
        );

        assert.throws(
            function() {
                moduleClass.get();
            },
            new Error('Firstly use the create method!'),
            'exception was thrown on get model before create'
        );
    };

    /**
     * @description test create model without factory class
     * @memberOf DemoApp.test.Factory.CircleTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.Factory.Circle} moduleClass
     */
    this.testCreateModelWithoutFactoryClass = function (assert, moduleClass) {
        assert.throws(
            function() {
                moduleClass.create(1);
            },
            new Error('Only can create from factory class!'),
            'exception was thrown on create without factory class'
        );
    };

    /**
     * @description test create model with factory class
     * @memberOf DemoApp.test.Factory.CircleTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.Factory.Circle} moduleClass
     */
    this.testCreateModelWithFactoryClass = function (assert, moduleClass) {
        var assertAsync = assert.async();

        manager.add('DemoApp.Factory', {
            data: {
                "amount": 1,
                "size": ["5rem"],
                "background": ["red"],
                "border": ["black"]
            }
        }).done(function (module) {
            moduleClass.create(1, module);

            moduleClass.setBackgroundColor('rgb(255, 165, 0)');

            var $circle = moduleClass.get();

            assert.ok(1 === $circle.length, 'create and get a model by factory');

            assert.ok(
                'rgb(255, 165, 0)' === $circle.css('background-color'),
                'set a model by factory'
            );

            assertAsync();
        });
    };
});
