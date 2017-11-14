"use strict";

/**
 * @class test delayed demo markup
 */
DIC.define('DemoApp.test.DelayedMarkupTest', new function () {
    /**
     * @description the manager mock
     * @memberOf DemoApp.test.DelayedMarkupTest
     * @alias {EquivalentJS.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf DemoApp.test.DelayedMarkupTest
     * @param {EquivalentJS.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test delayed demo markup
     * @memberOf DemoApp.test.DelayedMarkupTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.DelayedMarkup} moduleClass
     */
    this.testDelayedDemoMarkup = function (assert, moduleClass) {
        var assertAsync = assert.async();

        manager.add(moduleClass.type).done(function (module) {
            module.__markup__ = $('<div/>').get(0);

            $(module).on('ready:template', function () {
                assert.ok(
                    0 < $(module.__markup__).find('[data-template]').length,
                    'get delayed markup'
                );

                assert.ok(
                    -1 < $(module.__markup__).find('[data-template="block-1"]')
                        .html().indexOf('variable content example'),
                    'found variable placeholder replaced by data'
                );

                $(module.__markup__).append(module.__template__.getBlock('block-2'));

                assert.ok(
                    -1 < $(module.__markup__).find('[data-template="block-2"]')
                        .html().indexOf('static content'),
                    'found static content'
                );

                assertAsync();
            });
        }).fail(function () {
            assert.notOk(true, 'could not load module');

            assertAsync();
        });
    };
});
