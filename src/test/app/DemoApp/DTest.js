"use strict";

/**
 * @class test d
 */
DIC.define('DemoApp.test.DTest', new function () {
    /**
     * @description the manager mock
     * @memberOf DemoApp.test.DTest
     * @alias {EquivalentJS.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf DemoApp.test.DTest
     * @param {EquivalentJS.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test has assigned module class type by manager
     * @memberOf DemoApp.test.DTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.D} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'DemoApp.D' === moduleClass.type,
            'is DemoApp.D'
        );
    };

    /**
     * @description test has not constructed dependencies
     * @memberOf DemoApp.test.DTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.D} moduleClass
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
     * @memberOf DemoApp.test.DTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.D} moduleClass
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
            'DemoApp.C',
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

            manager.ready('DemoApp.C', function (module) {
                checkDependency(module, [
                    'DemoApp.A',
                    'DemoApp.B',
                    'DemoApp.D',
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
