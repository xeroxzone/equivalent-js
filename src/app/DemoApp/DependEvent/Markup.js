"use strict";

/** @module DemoApp/DependEvent */
/** @module DemoApp/DependEvent/Markup */

/**
 * @class
 * @classdesc an application demo event dependency
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} DemoApp.DependEvent.Markup
 * @constructs
 */
DIC.define('DemoApp.DependEvent.Markup', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.DependEvent.Markup
     * @private
     * @alias {DemoApp.DependEvent.Markup}
     */
    var _ = this;

    /**
     * @description wrap the demo markup with headline tag
     * @memberOf DemoApp.DependEvent.Markup
     * @param {jQuery} $demo the demo markup
     */
    _.wrapMarkup = function ($demo) {
        var title = $demo.text();

        $demo.html('<h1>' + title + '</h1>');

        $demo.removeClass('hidden');
    };
});
