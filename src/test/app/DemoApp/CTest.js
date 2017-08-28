"use strict";

/**
 * @class test c
 */
DIC.define('DemoApp.test.CTest', new function () {
    /**
     * @description the manager mock
     * @memberOf DemoApp.test.CTest
     * @alias {EquivalentJs.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf DemoApp.test.CTest
     * @param {EquivalentJs.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test has assigned module class type by manager
     * @memberOf DemoApp.test.CTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.C} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'DemoApp.C' === moduleClass.type,
            'is DemoApp.C'
        );
    };

    /**
     * @description test has not constructed dependencies
     * @memberOf DemoApp.test.CTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.C} moduleClass
     */
    this.testHasNotConstructedDependencies = function (assert, moduleClass) {
        var dependencies = moduleClass.getDependencies(),
            hasNoLoadedClasses = true
        ;

        $(dependencies).each(function () {
            if (null !== this) {
                hasNoLoadedClasses = false;
            }
        });

        assert.ok(
            hasNoLoadedClasses,
            'no dependencies because of no construction'
        );
    };

    /**
     * @description test has constructed dependencies
     * @memberOf DemoApp.test.CTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.C} moduleClass
     */
    this.testHasConstructedDependencies = function (assert, moduleClass) {
        var assertAsync = assert.async();

        var checkDependency = function (module, expect) {
            var classDepends = module.getDependencies();

            $(classDepends).each(function () {
                if (null !== this) {
                    assert.ok(-1 < expect.indexOf(this.type), module.type + ' dependency ' + this.type + ' ready');
                } else {
                    assert.notOk(null === this, module.type + ' dependency not ready');
                }
            });
        };

        manager.add([
            moduleClass.type,
            'DemoApp.A',
            'DemoApp.B',
            'DemoApp.D',
            'DemoApp.E'
        ]).done(function () {
            manager.ready('DemoApp.A', function (module) {
                checkDependency(module, [
                    'DemoApp.B',
                    'DemoApp.C',
                    'DemoApp.D',
                    'DemoApp.E'
                ]);
            });

            manager.ready('DemoApp.B', function (module) {
                checkDependency(module, [
                    'DemoApp.A',
                    'DemoApp.C',
                    'DemoApp.D',
                    'DemoApp.E'
                ]);
            });

            manager.ready('DemoApp.D', function (module) {
                checkDependency(module, [
                    'DemoApp.A',
                    'DemoApp.B',
                    'DemoApp.C',
                    'DemoApp.E'
                ]);
            });

            manager.ready('DemoApp.E', function (module) {
                checkDependency(module, [
                    'DemoApp.A',
                    'DemoApp.B',
                    'DemoApp.C',
                    'DemoApp.D'
                ]);

                assertAsync();
            });
        });
    };
});
