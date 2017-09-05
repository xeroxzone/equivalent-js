"use strict";

/** @var {(jQuery|function)} $ */

/**
 * @namespace
 * @typedef {Object} EquivalentJS
 */
var EquivalentJS = {};

/** @module EquivalentJS */

/**
 * @class
 * @classdesc Initial loaded class as running system
 *  to register the module {@link EquivalentJS.Manager};
 *  the test runner and the doc runner
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.System
 * @constructs
 */
EquivalentJS.System = new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.System
     * @private
     * @alias {EquivalentJS.System}
     */
    var _ = this;

    /**
     * @description the system configuration
     *  {@link EquivalentJS.System~configuration}
     * @memberOf EquivalentJS.System
     * @private
     * @type {Object}
     */
    var configuration;

    /**
     * @description the system environment
     * @memberOf EquivalentJS.System
     * @private
     * @type {string}
     * @default
     */
    var environment = 'dev';

    /**
     * @description the shortcut interface name
     * @memberOf EquivalentJS.System
     * @private
     * @type {string}
     * @default
     */
    var shortcut = 'DIC';

    /**
     * @description path to module class root directory
     * @memberOf EquivalentJS.System
     * @private
     * @type {string}
     */
    var moduleUri;

    /**
     * @description path to documentation framework directory
     * @memberOf EquivalentJS.System
     * @private
     * @type {string}
     */
    var docFrameworkUri;

    /**
     * @description path to test framework directory
     * @memberOf EquivalentJS.System
     * @private
     * @type {string}
     */
    var testFrameworkUnitUri;

    /**
     * @description path to test framework theme
     * @memberOf EquivalentJS.System
     * @private
     * @type {string}
     */
    var testFrameworkThemeUri;

    /**
     * @description set module type before autoload can do this
     * @memberOf EquivalentJS.System
     * @type {string}
     * @default
     */
    _.type = 'EquivalentJS.System';

    /**
     * @description is the testing framework is activated
     * @memberOf EquivalentJS.System
     * @type {boolean}
     * @default
     */
    _.testing = false;

    /**
     * @description initialize manager, test and documentation framework
     * @memberOf EquivalentJS.System
     * @param {boolean=} testRun if true then system can be manually handled by tests
     * @param {function=} testCallback if testRun is true then give a callback function
     *  to get the finish of system configuration load
     */
    _.construct = function (testRun, testCallback) {
        testRun = testRun || false;
        configure(function () {
            if (false === testRun) {
                register({type: 'EquivalentJS.Manager'});
                if ('dev' === environment) {
                    registerTestFramework();
                    registerDocFramework();
                }
            } else {
                testCallback();
            }
        });
    };

    /**
     * @description configure system paths
     * @memberOf EquivalentJS.System
     * @private
     * @param {function} registerCallback the callback to register
     *  module manager, test and doc framework
     * @throws {Error} could not interpret json configuration as <Object>
     */
    var configure = function (registerCallback) {
        /**
         * @type {string}
         */
        var configPath = 'js/config/parameters.json';

        if (typeof window.EquivalentJSConfigurationPath !== 'undefined') {
            /**
             * @description give a global path to configuration json file
             * @typedef {string} EquivalentJSConfigurationPath
             */
            configPath = window.EquivalentJSConfigurationPath;
        }

        $.get(configPath)
            .done(function (data) {
                if (typeof data !== 'object') {
                    throw new Error('Invalid configuration json file!');
                }

                /**
                 * @type {{
                 *  shortcut: string,
                 *  environment: string,
                 *  modulePath: string,
                 *  docFramework: string,
                 *  testFrameworkUnit: string,
                 *  testFrameworkTheme: string
                 * }}
                 */
                configuration = data;
                shortcut = configuration.shortcut;
                environment = configuration.environment;
                moduleUri = configuration.modulePath;
                docFrameworkUri = configuration.docFramework;
                testFrameworkUnitUri = configuration.testFrameworkUnit;
                testFrameworkThemeUri = configuration.testFrameworkTheme;

                if ('dev' !== environment) {
                    var disabledConsole = EquivalentJS.console = {};
                    $(['clear', 'dir', 'trace', 'log',
                        'info', 'warn', 'error'
                    ]).each(function () {
                        disabledConsole[this] = function () {};
                    });
                } else {
                    EquivalentJS.console = window.console || {};
                }

                if (typeof registerCallback === 'function') {
                    /**
                     * @description define new module class
                     *  {@link EquivalentJS.System~define}
                     * @memberOf EquivalentJS
                     * @typedef {function} EquivalentJS.define
                     */
                    EquivalentJS.define = define;

                    registerCallback();
                }
            })
            .fail(function (error) {
                EquivalentJS.console.error(
                    error.status + ' ' + error.statusText +
                    ' - Could not load configuration!'
                );
            });
    };

    /**
     * @description register module manager
     * @memberOf EquivalentJS.System
     * @private
     * @param {Object} module the module object with module class
     * @param {string} module.type as module class name
     */
    var register = function (module) {
        var type = module.type;

        var namespace = _.getNamespace(type);

        var moduleUrl = moduleUri + '/' +
            namespace + '.js?' + String((new Date()).getTime());

        $.get(moduleUrl)
            .done(function () {
                $(EquivalentJS.Manager).on('ready:manager', function () {
                    try {
                        EquivalentJS.Manager.construct(moduleUri);
                        registerShortcut();
                    } catch (error) {
                        EquivalentJS.console.error(error);
                    }
                }).trigger('ready:manager', module).off('ready:manager');
            })
            .fail(function (error) {
                EquivalentJS.console.error(
                    error.status + ' ' + error.statusText +
                    ' - Could not load module "' + namespace + '"!'
                );
            });
    };

    /**
     * @description register shortcut interface
     * @memberOf EquivalentJS.System
     * @private
     * @throws {Error} if shortcut interface name is
     *  of wrong type or namespace is already taken
     */
    var registerShortcut = function () {
        if (typeof shortcut === 'string' &&
            0 < shortcut.length &&
            EquivalentJS.hasOwnProperty('Manager')
        ) {
            var manager = EquivalentJS.Manager;

            /**
             * @typedef {Object} DIC the default shortcut interface name
             * @type {{
             *  console: Object,
             *  getNamespace: function,
             *  define: function,
             *  add: function,
             *  ready: function,
             *  has: function,
             *  get: function,
             *  remove: function
             * }}
             */
            var shortcutInterface = {
                console: EquivalentJS.console,
                getNamespace: _.getNamespace,
                define: define,
                add: manager.add,
                ready: manager.ready,
                has: manager.has,
                get: manager.get,
                remove: manager.remove
            };

            if (typeof window[shortcut] === 'undefined') {
                window[shortcut] = shortcutInterface;
            } else {
                throw new Error(
                    'Could not register shortcut' +
                    ' interface name "' + shortcut + '"!' +
                    ' Please choose a not defined namespace.'
                );
            }
        } else {
            throw new Error('Name of shortcut must be of type <string>.');
        }
    };

    /**
     * @description register documentation framework
     * @memberOf EquivalentJS.System
     * @private
     * @example "?docs" add url get parameter to start doc runner
     * @example "?docs-stop" add url get parameter to stop doc runner
     */
    var registerDocFramework = function () {
        var docRunner = 'jsdoc';

        if (-1 < location.search.indexOf('docs-stop')) {
            sessionStorage.removeItem('runDocs');
            $('> iframe', '#' + docRunner).remove();
        } else if (true === Boolean(sessionStorage.getItem('runDocs')) ||
            -1 < location.search.indexOf('docs')
        ) {
            $('body').prepend('<section class="docs">' +
                '<div id="' + docRunner + '"></div>' +
            '</section>');

            sessionStorage.setItem('runDocs', true);

            $.ajax(docFrameworkUri, {method: 'head'})
                .fail(function (error) {
                    EquivalentJS.console.error(
                        error.status + ' ' + error.statusText +
                        ' - Could not load layout for test framework!'
                    );
                });

            $(function() {
                var refreshTimeout = 10240,
                    refreshInterval = 0,
                    refreshFrame = function () {
                        $('> iframe', '#' + docRunner).get(0).contentDocument.location.reload();
                    };

                $('body').css({overflow: 'hidden'});

                $('<button/>').addClass('mdc-button mdc-button--raised').prop({
                    'id': 'doc-runner-control'
                }).css({
                    position: 'fixed',
                    zIndex: 1001,
                    top: '.5rem',
                    right: '6rem',
                    display: 'inline',
                    width: '6rem',
                    textTransform: 'uppercase'
                }).text('running').appendTo('#' + docRunner);

                $('<iframe/>').attr({
                    'src': docFrameworkUri,
                    'frameborder': 0
                }).css({
                    background: 'white',
                    border: '0 none',
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    zIndex: 1000,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }).appendTo('#' + docRunner);

                setTimeout(function () {
                    var $runnerControl = $('#doc-runner-control').on('click', function () {
                        location.search = 'docs-stop';
                    }).on('mouseover', function () {
                        $(this).text('exit');
                    });

                    $('> iframe', '#' + docRunner).on('mouseover mouseenter', function () {
                        clearInterval(refreshInterval);
                        refreshInterval = 0;
                        $runnerControl.text('stopped');
                    }).on('mouseout mouseleave', function () {
                        clearInterval(refreshInterval);
                        refreshInterval = setInterval(refreshFrame, refreshTimeout);
                        $runnerControl.text('running');
                    });

                    refreshInterval = setInterval(refreshFrame, refreshTimeout);
                }, refreshTimeout / 10);
            });
        }
    };

    /**
     * @description register test framework
     * @memberOf EquivalentJS.System
     * @private
     * @example "?tests" add url get parameter to start test runner
     * @example "?tests-stop" add url get parameter to stop test runner
     */
    var registerTestFramework = function () {
        if (-1 < location.search.indexOf('tests-stop')) {
            sessionStorage.removeItem('runTests');
        } else if (true === Boolean(sessionStorage.getItem('runTests')) ||
            -1 < location.search.indexOf('tests')
        ) {
            $(document).ajaxStart(function() {
                $(document.body).css({cursor: 'wait'});
            }).ajaxStop(function() {
                $(document.body).css({cursor: 'default'});
            });

            $.ajax(testFrameworkThemeUri, {method: 'head'})
                .fail(function (error) {
                    EquivalentJS.console.error(
                        error.status + ' ' + error.statusText +
                        ' - Could not load layout for test framework!'
                    );
                });

            var $link = $('<link/>').attr({
                'rel': 'stylesheet',
                'href': testFrameworkThemeUri
            });

            $('head').append($link);

            $('body').css({overflow: 'hidden'}).prepend('<section class="debug">' +
                '<div id="qunit"></div>' +
                '<div id="qunit-fixture"></div>' +
            '</section>');

            $.getScript(testFrameworkUnitUri)
                .done(function () {
                    /**
                     * @description test framework integration
                     * @memberOf EquivalentJS
                     * @type {{Unit: QUnit}}
                     * @typedef {QUnit} EquivalentJS.test.Unit
                     * @typedef {Assert} EquivalentJS.test.Unit.assert
                     */
                    EquivalentJS.test = {
                        Unit: window.QUnit || {}
                    };

                    _.testing = true;
                })
                .fail(function (error) {
                    EquivalentJS.console.error(
                        error.status + ' ' + error.statusText +
                        ' - Could not load library for test framework!'
                    );
                });

            $('<div><ul></ul></div>').addClass('missing-tests-log').appendTo('.debug');

            $('<button/>').addClass('mdc-button mdc-button--raised').prop({
                'id': 'test-runner-control'
            }).css({
                position: 'fixed',
                zIndex: 1001,
                top: '.5rem',
                right: '1rem',
                display: 'inline',
                width: '3rem',
                textTransform: 'uppercase'
            }).text('✖').appendTo('.debug');

            $(document).on('click', '#test-runner-control', function () {
                location.search = 'tests-stop';
            });

            var hidePassedTests = function () {
                var $passed = $('li.pass');
                if (true === $('input[name="hidepassed"]').prop('checked')) {
                    $passed.hide();
                } else {
                    $passed.show();
                }
            },
            hideTimer = 0;

            $(document.body).on('click', 'input[name="hidepassed"]', function () {
                hidePassedTests();
            });

            $(document).ajaxStop(function() {
                clearTimeout(hideTimer);
                hideTimer = 0;
                hideTimer = setTimeout(function () {
                    hidePassedTests();
                }, 1000);
            });

            sessionStorage.setItem('runTests', true);
        }
    };

    /**
     * @description prepare module class namespace in DOM
     * @memberOf EquivalentJS.System
     * @private
     * @param {string} type as module class name
     * @param {EquivalentJS.Manager.Module.class} moduleClass to be defined into DOM
     */
    var createModuleDOM = function (type, moduleClass) {
        var classScope = window,
            classPath = type.split('.');

        $(classPath).each(function (i) {
            if (typeof classScope[classPath[i]] === 'undefined') {
                classScope[classPath[i]] = {};
                if (classPath.length -1 === i) {
                    classScope[classPath[i]] = moduleClass;
                }
            } else if (typeof classScope[classPath[i]] === 'object' &&
                Object.keys(classScope[classPath[i]]).length > 0
            ) {
                if (classPath.length -1 === i) {
                    $.extend(true, classScope[classPath[i]], moduleClass);
                }
            }
            classScope = classScope[classPath[i]];
        });
    };

    /**
     * @description define a new module by type and module class
     * @memberOf EquivalentJS.System
     * @private
     * @param {string} type as module class name
     * @param {EquivalentJS.Manager.Module.class} moduleClass as class object
     * @throws {Error} module class definition wrong
     */
    var define = function (type, moduleClass) {
        if (typeof type !== 'string') {
            throw new Error('The module class type must be of type <string>.');
        }

        if (typeof moduleClass === 'object') {
            createModuleDOM(type, moduleClass);
        } else {
            throw new Error('The module class must be of type <Object>.');
        }
    };

    /**
     * @description get namespace pattern as module path from dot notated path
     * @memberOf EquivalentJS.System
     * @param {string} type as module class name
     * @returns {string}
     * @example EquivalentJS.System.getNamespace('EquivalentJS.namespace.part.ClassName');
     *  // returns: nameSpace/part/ClassName
     */
    _.getNamespace = function (type) {
        return String(type)
            .replace(/^\w+\./, '')
            .replace(/\.+/g, '/');
    };

    /**
     * @description returns the system configuration
     * @memberOf EquivalentJS.System
     * @return {Object}
     */
    _.getConfiguration = function () {
        return configuration;
    };
};

EquivalentJS.System.construct();
