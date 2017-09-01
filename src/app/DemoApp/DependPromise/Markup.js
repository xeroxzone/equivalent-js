"use strict";

/** @module DemoApp/DependPromise */
/** @module DemoApp/DependPromise/Markup */

/**
 * @class
 * @classdesc an application demo promise dependency
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {function} DemoApp.DependPromise.Markup
 * @constructs
 */
DIC.define('DemoApp.DependPromise.Markup', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.DependPromise.Markup
     * @private
     * @alias {DemoApp.DependPromise.Markup}
     */
    var _ = this;

    /**
     * @description wrap the demo markup with headline tag
     * @memberOf DemoApp.DependPromise.Markup
     * @param {jQuery} $demo the demo markup
     */
    _.wrapMarkup = function ($demo) {
        var title = $demo.text();

        $demo.html('<h1>' + title + '</h1>');

        $demo.removeClass('hidden');
    };
});
