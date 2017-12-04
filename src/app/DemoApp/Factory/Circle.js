"use strict";

/** @module DemoApp/Factory */
/** @module DemoApp/Factory/Circle */

/**
 * @class
 * @classdesc a model to be created by factory
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.Factory.Circle
 * @constructs
 */
DIC.define('DemoApp.Factory.Circle', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.Factory.Circle
     * @private
     * @alias {DemoApp.Factory.Circle}
     */
    var _ = this;

    /**
     * @description the circle element
     * @memberOf DemoApp.Factory.Circle
     * @private
     * @type {?jQuery}
     */
    var $circle = null;

    /**
     * @description throws an error if the create method was not called
     * @memberOf DemoApp.Factory.Circle
     * @private
     * @throws {Error} if the create method was not called
     *  before use of setters or getters
     */
    var onCreateError = function () {
        throw new Error('Firstly use the create method!');
    };

    /**
     * @description create a circle
     * @memberOf DemoApp.Factory.Circle
     * @requires module:DemoApp/Factory
     * @param {number} id as int
     * @param {DemoApp.Factory} factory the creator class
     * @param {string} factory.type check for correct factory class type
     * @returns {this}
     * @throws {Error} if the create method
     *  is not called from the correct factory class type
     */
    _.create = function (id, factory) {
        if (typeof factory === 'undefined' ||
            (factory.hasOwnProperty('type') &&
                'DemoApp.Factory' !== factory.type)
        ) {
            throw new Error('Only can create from factory class!');
        }

        $circle = $('<div></div>');

        $circle
            .prop({
                id: 'circle-' + id
            })
            .addClass('circle')
        ;

        delete _.create;

        return _;
    };

    /**
     * @description set circle size
     * @memberOf DemoApp.Factory.Circle
     * @param {string} size the width and height proportion
     * @returns {this}
     */
    _.setSize = function (size) {
        if (null === $circle) {onCreateError();}

        $circle
            .css({
                width: size,
                height: size
            })
        ;

        return _;
    };

    /**
     * @description set circle background color
     * @memberOf DemoApp.Factory.Circle
     * @param {string} color for the background
     * @returns {this}
     */
    _.setBackgroundColor = function (color) {
        if (null === $circle) {onCreateError();}

        $circle
            .css({
                backgroundColor: color,
                borderWidth: '.1rem',
                borderStyle: 'solid'
            })
        ;

        return _;
    };

    /**
     * @description set circle border color
     * @memberOf DemoApp.Factory.Circle
     * @param {string} color for the border
     * @returns {this}
     */
    _.setBorderColor = function (color) {
        if (null === $circle) {onCreateError();}

        $circle
            .css({
                borderColor: color
            })
        ;

        return _;
    };

    /**
     * @description get a circle after create and set parameters
     * @memberOf DemoApp.Factory.Circle
     * @returns {jQuery}
     */
    _.get = function () {
        if (null === $circle) {onCreateError();}

        return $circle;
    };
});
