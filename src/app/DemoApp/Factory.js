"use strict";

/** @module DemoApp/Factory */

/**
 * @class
 * @classdesc an application demo as a factory
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {function} DemoApp.Factory
 * @constructs
 */
DIC.define('DemoApp.Factory', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.Factory
     * @private
     * @alias {DemoApp.Factory}
     */
    var _ = this;

    /**
     * @description the circle model
     * @memberOf DemoApp.Factory
     * @private
     * @alias {DemoApp.Factory.Circle}
     * @see DemoApp.Factory.Circle
     */
    var Circle;

    /**
     * @description holds the created circles
     * @memberOf DemoApp.Factory
     * @private
     * @type {Array.<DemoApp.Factory.Circle>}
     */
    var circles = [];

    /**
     * @description autoload stylesheet for display
     * @memberOf DemoApp.Factory
     * @type {boolean}
     */
    _.layout = true;

    /**
     * @description the application DOM
     * @memberOf DemoApp.Factory
     * @type {?jQuery}
     */
    _.$demoFactoryApp = null;

    /**
     * @description construct the module class
     * @memberOf DemoApp.Factory
     * @param {Object} module the request parameters
     */
    _.construct = function (module) {
        if (typeof module === 'undefined' ||
            !module.hasOwnProperty('parameters')
        ) {
            throw new Error('Missing construction parameters object!');
        }

        /**
         * @type {{data: {
         *  amount: number,
         *  size: string,
         *  background: string,
         *  border: string
         * }}}
         */
        var parameters = module.parameters;

        _.$demoFactoryApp = $('[data-application="DemoApp.Factory"]');

        prepareCircleModel(parameters);
        showCreateCirclesControl();
    };

    /**
     * @description render circles
     * @memberOf DemoApp.Factory
     * @throws {Error} if no circles was constructed through factory class construct
     */
    _.renderCircles = function () {
        if (0 === circles.length) {
            throw new Error('No circles constructed yet!');
        }

        $(circles).each(function () {
            var circle = this;

            _.$demoFactoryApp.append(circle.get());
        });
    };

    /**
     * @description show create circle control button
     * @memberOf DemoApp.Factory
     * @private
     */
    var showCreateCirclesControl = function () {
        var $control = _.$demoFactoryApp.find('button').removeClass('hidden');

        $control.on('click', function () {
            _.renderCircles();
        });
    };

    /**
     * @description prepare circle model
     * @memberOf DemoApp.Factory
     * @private
     * @requires module:DemoApp/Factory/Circle
     * @param {Object} parameters to build circles
     */
    var prepareCircleModel = function (parameters) {
        /**
         * @type {number}
         */
        var amount = 0;

        /**
         * @type {Object}
         */
        var options = {};

        if (typeof parameters !== 'undefined' &&
            parameters.hasOwnProperty('data') &&
            parameters.data.hasOwnProperty('amount') &&
            parameters.data.hasOwnProperty('size') &&
            parameters.data.hasOwnProperty('background') &&
            parameters.data.hasOwnProperty('border')
        ) {
            amount = parameters.data.amount;
            options = {
                size: parameters.data.size,
                background: parameters.data.background,
                border: parameters.data.border
            };

            _.__manager__.add('DemoApp.Factory.Circle')
                .done(function (module) {
                    Circle = module;

                    handleCircles(amount, options);
                });
        } else {
            throw new Error('Missing construction parameters object properties!');
        }
    };

    /**
     * @description handle created circles
     * @memberOf DemoApp.Factory
     * @private
     * @param {number} amount as int
     * @param {Object} options for creation
     */
    var handleCircles = function (amount, options) {
        $(new Array(amount)).each(function (i) {
            circles.push(createCircle(
                i,
                options.size[i],
                options.background[i],
                options.border[i]
            ));
        });
    };

    /**
     * @description create a new circle
     * @memberOf DemoApp.Factory
     * @private
     * @param {number} id as int
     * @param {string} size set the size
     * @param {string} background set the background
     * @param {string} border set the border
     * @returns {DemoApp.Factory.Circle}
     * @throws {Error} if the circle {@link DemoApp.Factory.Circle.create}
     *  method is not called
     */
    var createCircle = function (id, size, background, border) {
        var circle = new Circle.constructor();

        try {
            circle
                .create(id, _)
                .setSize(size)
                .setBackgroundColor(background)
                .setBorderColor(border)
            ;
        } catch (error) {
            EquivalentJS.console.error(error);
        }

        return circle;
    };
});
