"use strict";

/**
 * @class test demo factory
 */
DIC.define('DemoApp.test.FactoryTest', new function () {
    /**
     * @description the manager mock
     * @memberOf DemoApp.test.FactoryTest
     * @alias {EquivalentJs.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf DemoApp.test.FactoryTest
     * @type {?jQuery}
     */
    var $mockApp = null;

    /**
     * @description setup the manager and variables
     * @memberOf DemoApp.test.FactoryTest
     * @param {EquivalentJs.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;

        $mockApp = $('<div/>').addClass('app-demo-factory-mock')
            .html('<button class="hidden"></button>');
    };

    /**
     * @description test has assigned module class type by manager
     * @memberOf DemoApp.test.FactoryTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.Factory} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'DemoApp.Factory' === moduleClass.type,
            'is DemoApp.Factory'
        );
    };

    /**
     * @description test factory class with wrong construction parameters
     * @memberOf DemoApp.test.FactoryTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.Factory} moduleClass
     */
    this.testWithWrongConstructionParameters = function (assert, moduleClass) {
        assert.throws(
            function() {
                moduleClass.construct();
            },
            new Error('Missing construction parameters object!'),
            'exception was thrown on missing construction parameters object'
        );

        assert.throws(
            function() {
                moduleClass.construct({
                    parameters: {}
                });
            },
            new Error('Missing construction parameters object properties!'),
            'exception was thrown on missing construction parameters object properties'
        );
    };

    /**
     * @description test render circles without construct the factory class
     * @memberOf DemoApp.test.FactoryTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.Factory} moduleClass
     */
    this.testRenderCirclesWithoutConstruct = function (assert, moduleClass) {
        assert.throws(
            function() {
                moduleClass.renderCircles();
            },
            new Error('No circles constructed yet!'),
            'exception was thrown on not constructed factory class'
        );
    };

    /**
     * @description test render circles with circle model
     * @memberOf DemoApp.test.FactoryTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.Factory} moduleClass
     */
    this.testRenderCirclesWithCircleModel = function (assert, moduleClass) {
        var assertAsync = assert.async();

        manager.add(moduleClass.type, {
            data: {
                "amount": 2,
                "size": ["5rem", "4rem"],
                "background": ["red", "green"],
                "border": ["black", "black"]
            }
        }).done(function (module) {
            module.$demoFactoryApp = $mockApp;

            manager.ready(moduleClass.type + '.Circle', function () {
                var $button = module.$demoFactoryApp.find('button');

                $button.on('click', function () {
                    try {
                        module.renderCircles();
                    } catch (error) {
                        EquivalentJs.console.error(error);
                    }

                    assert.ok(
                        2 === module.$demoFactoryApp.find('.circle').length,
                        'get rendered circles'
                    );

                    assertAsync();
                });

                // awaiting user click interaction
                setTimeout(function () {
                    $button.trigger('click');
                }, 1000);
            });
        }).fail(function () {
            assert.notOk(false, 'could not load module');

            assertAsync();
        });
    };
});
