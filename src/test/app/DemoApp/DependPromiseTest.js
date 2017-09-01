"use strict";

/**
 * @class
 */
DIC.define('DemoApp.test.DependPromiseTest', new function () {
    /**
     * @description the manager mock
     * @memberOf DemoApp.test.DependPromiseTest
     * @alias {EquivalentJS.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf DemoApp.test.DependPromiseTest
     * @param {EquivalentJS.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test {@link DemoApp.DependPromise} has a text
     * @memberOf DemoApp.test.DependPromiseTest
     * @param {EquivalentJS.test.Unit.assert} assert
     */
    this.testHasText = function (assert) {
        var $demo = $('[data-application="DemoApp.DependPromise"]');

        assert.ok($demo.text().indexOf('Demo with Promise') > 0, 'has text');
    };

    /**
     * @description test markup wrapper class dependency is done
     * @memberOf DemoApp.test.DependPromiseTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.DependPromise} moduleClass
     */
    this.testMarkupWrapperIsDone = function (assert, moduleClass) {
        var assertAsync = assert.async(),
            $demo = $('<div/>').addClass('test-mock').append(
                $('<h1/>').addClass('color-event-1')
            );

        manager.add(moduleClass.type, {app: $demo.get(0)}).done(function () {
            manager.add(moduleClass.type + '.Markup').done(function () {
                assert.ok(manager.has(moduleClass.type), 'markup wrapper is done');

                assertAsync();

                manager.remove(moduleClass.type);
            });
        });
    };
});
