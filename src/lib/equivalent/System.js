"use strict";

/** @var {(jQuery|function)} $ */

/**
 * @namespace
 * @typedef {Object} EquivalentJs
 */
var EquivalentJs = {};

/** @module EquivalentJs */

/**
 * @class
 * @classdesc Initial loaded class as running system
 *  to register the module {@link EquivalentJs.Manager};
 *  the test runner and the doc runner
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.System
 * @constructs
 */
EquivalentJs.System = new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.System
     * @private
     * @alias {EquivalentJs.System}
     */
    var _ = this;

    /**
     * @description the system configuration
     *  {@link EquivalentJs.System~configuration}
     * @memberOf EquivalentJs.System
     * @private
     * @type {Object}
     */
    var configuration;

    /**
     * @description the system environment
     * @memberOf EquivalentJs.System
     * @private
     * @type {string}
     * @default
     */
    var environment = 'dev';

    /**
     * @description the shortcut interface name
     * @memberOf EquivalentJs.System
     * @private
     * @type {string}
     * @default
     */
    var shortcut = 'MAJS';

    /**
     * @description path to module class root directory
     * @memberOf EquivalentJs.System
     * @private
     * @type {string}
     */
    var moduleUri;

    /**
     * @description path to documentation framework directory
     * @memberOf EquivalentJs.System
     * @private
     * @type {string}
     */
    var docFrameworkUri;

    /**
     * @description path to test framework directory
     * @memberOf EquivalentJs.System
     * @private
     * @type {string}
     */
    var testFrameworkUnitUri;

    /**
     * @description path to test framework theme
     * @memberOf EquivalentJs.System
     * @private
     * @type {string}
     */
    var testFrameworkThemeUri;

    /**
     * @description set module type before autoload can do this
     * @memberOf EquivalentJs.System
     * @type {string}
     * @default
     */
    _.type = 'EquivalentJs.System';

    /**
     * @description is the testing framework is activated
     * @memberOf EquivalentJs.System
     * @type {boolean}
     * @default
     */
    _.testing = false;

    /**
     * @description initialize manager, test and documentation framework
     * @memberOf EquivalentJs.System
     * @param {boolean=} testRun if true then system can be manually handled by tests
     * @param {function=} testCallback if testRun is true then give a callback function
     *  to get the finish of system configuration load
     */
    _.construct = function (testRun, testCallback) {
        testRun = testRun || false;
        configure(function () {
            if (false === testRun) {
                register({type: 'EquivalentJs.Manager'});
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
     * @description configure system pathes
     * @memberOf EquivalentJs.System
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

        if (typeof window.EquivalentJsConfigurationPath !== 'undefined') {
            /**
             * @description give a global path to configuration json file
             * @typedef {string} EquivalentJsConfigurationPath
             */
            configPath = window.EquivalentJsConfigurationPath;
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
                    var disabledConsole = EquivalentJs.console = {};
                    $(['clear', 'dir', 'trace', 'log',
                        'info', 'warn', 'error'
                    ]).each(function () {
                        disabledConsole[this] = function () {};
                    });
                } else {
                    EquivalentJs.console = window.console || {};
                }

                if (typeof registerCallback === 'function') {
                    /**
                     * @description define new module class
                     *  {@link EquivalentJs.System~define}
                     * @memberOf EquivalentJs
                     * @typedef {function} EquivalentJs.define
                     */
                    EquivalentJs.define = define;

                    registerCallback();
                }
            })
            .fail(function (error) {
                EquivalentJs.console.error(
                    error.status + ' ' + error.statusText +
                    ' - Could not load configuration!'
                );
            });
    };

    /**
     * @description register module manager
     * @memberOf EquivalentJs.System
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
                $(EquivalentJs.Manager).on('ready:manager', function () {
                    try {
                        EquivalentJs.Manager.construct(moduleUri);
                        registerShortcut();
                    } catch (error) {
                        EquivalentJs.console.error(error);
                    }
                }).trigger('ready:manager', module).off('ready:manager');
            })
            .fail(function (error) {
                EquivalentJs.console.error(
                    error.status + ' ' + error.statusText +
                    ' - Could not load module "' + namespace + '"!'
                );
            });
    };

    /**
     * @description register shortcut interface
     * @memberOf EquivalentJs.System
     * @private
     * @throws {Error} if shortcut interface name is
     *  of wrong type or namespace is already taken
     */
    var registerShortcut = function () {
        if (typeof shortcut === 'string' &&
            0 < shortcut.length &&
            EquivalentJs.hasOwnProperty('Manager')
        ) {
            var manager = EquivalentJs.Manager;

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
                console: EquivalentJs.console,
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
     * @memberOf EquivalentJs.System
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
                    EquivalentJs.console.error(
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
     * @memberOf EquivalentJs.System
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
                    EquivalentJs.console.error(
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
                     * @memberOf EquivalentJs
                     * @type {{Unit: QUnit}}
                     * @typedef {QUnit} EquivalentJs.test.Unit
                     * @typedef {Assert} EquivalentJs.test.Unit.assert
                     */
                    EquivalentJs.test = {
                        Unit: window.QUnit || {}
                    };

                    _.testing = true;
                })
                .fail(function (error) {
                    EquivalentJs.console.error(
                        error.status + ' ' + error.statusText +
                        ' - Could not load library for test framework!'
                    );
                });

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
     * @memberOf EquivalentJs.System
     * @private
     * @param {string} type as module class name
     * @param {EquivalentJs.Manager.Module.class} moduleClass to be defined into DOM
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
     * @memberOf EquivalentJs.System
     * @private
     * @param {string} type as module class name
     * @param {EquivalentJs.Manager.Module.class} moduleClass as class object
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
     * @memberOf EquivalentJs.System
     * @param {string} type as module class name
     * @returns {string}
     * @example EquivalentJs.System.getNamespace('EquivalentJs.namespace.part.ClassName');
     *  // returns: nameSpace/part/ClassName
     */
    _.getNamespace = function (type) {
        return String(type)
            .replace(/^\w+\./, '')
            .replace(/\.+/g, '/');
    };

    /**
     * @description returns the system configuration
     * @memberOf EquivalentJs.System
     * @return {Object}
     */
    _.getConfiguration = function () {
        return configuration;
    };
};

EquivalentJs.System.construct();
