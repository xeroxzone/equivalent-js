"use strict";

/**
 * @class
 */
DIC.define('DemoApp.test.tool.LogoTest', new function () {
    /**
     * @description test {@link DemoApp.tool.Logo} has a logo
     * @memberOf DemoApp.test.tool.LogoTest
     * @param {EquivalentJs.test.Unit.assert} assert
     */
    this.testHasLogo = function (assert) {
        var $logo = $('[data-application="DemoApp.tool.Logo"] .equivalent-js-logo');

        assert.ok($logo.length > 0, 'has logo');
    };
});
