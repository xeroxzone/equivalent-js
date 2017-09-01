"use strict";

/**
 * @class test renderer module
 */
DIC.define('EquivalentJS.test.RendererTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf EquivalentJS.test.RendererTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Renderer} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJS.Renderer' === moduleClass.type,
            'is EquivalentJS.Renderer'
        );
    };

    /**
     * @description test is {@link EquivalentJS.Renderer.display} available
     * @memberOf EquivalentJS.test.RendererTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Renderer} moduleClass
     */
    this.testIsDisplayAvailable = function (assert, moduleClass) {
        moduleClass.construct();

        assert.ok(
            moduleClass.display.hasClass('display'),
            'display target viewport is available'
        );
    };
});
