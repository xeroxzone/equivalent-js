"use strict";

/**
 * @class test renderer module
 */
DIC.define('EquivalentJs.test.RendererTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf EquivalentJs.test.RendererTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Renderer} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJs.Renderer' === moduleClass.type,
            'is EquivalentJs.Renderer'
        );
    };

    /**
     * @description test is {@link EquivalentJs.Renderer.display} available
     * @memberOf EquivalentJs.test.RendererTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Renderer} moduleClass
     */
    this.testIsDisplayAvailable = function (assert, moduleClass) {
        moduleClass.construct();

        assert.ok(
            moduleClass.display.hasClass('display'),
            'display target viewport is available'
        );
    };
});
