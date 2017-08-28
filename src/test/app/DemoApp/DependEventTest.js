"use strict";

/**
 * @class
 */
DIC.define('DemoApp.test.DependEventTest', new function () {
    /**
     * @description the manager mock
     * @memberOf DemoApp.test.DependEventTest
     * @alias {EquivalentJs.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf DemoApp.test.DependEventTest
     * @param {EquivalentJs.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test {@link DemoApp.DependEvent} has a text
     * @memberOf DemoApp.test.DependEventTest
     * @param {EquivalentJs.test.Unit.assert} assert
     */
    this.testHasText = function (assert) {
        var $demo = $('[data-application="DemoApp.DependEvent"]');

        assert.ok($demo.text().indexOf('Demo on Event') > -1, 'has text');
    };

    /**
     * @description test markup wrapper class dependency is ready
     * @memberOf DemoApp.test.DependEventTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.DependEvent} moduleClass
     */
    this.testMarkupWrapperIsReady = function (assert, moduleClass) {
        var assertAsync = assert.async(),
            $demo = $('<div/>').addClass('test-mock').append(
                $('<h1/>').addClass('color-event-1')
            );

        manager.add(moduleClass.type, {app: $demo.get(0)}).done(function () {
            manager.ready(moduleClass.type + '.Markup', function () {
                assert.ok(manager.has(moduleClass.type), 'markup wrapper is ready');

                assertAsync();

                manager.remove('DemoApp.DependEvent');
            });

            manager.add(moduleClass.type + '.Markup');
        });
    };
});
