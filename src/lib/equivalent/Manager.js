"use strict";

/** @module EquivalentJS/Manager */

/**
 * @class
 * @classdesc The module manager for dependencies and class autoloads
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.Manager
 * @constructs
 */
EquivalentJS.define('EquivalentJS.Manager', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.Manager
     * @private
     * @alias {EquivalentJS.Manager}
     */
    var _ = this;

    /**
     * @description path to module class root directory will be set on construct
     * @memberOf EquivalentJS.Manager
     * @private
     * @type {string}
     */
    var moduleUri = '';

    /**
     * @description setted true to test the manager by unit tests
     * @memberOf EquivalentJS.Manager
     * @private
     * @type {boolean}
     * @default
     */
    var testing = false;

    /**
     * @description stored type names to prepare modules for DIC
     * @memberOf EquivalentJS.Manager
     * @private
     * @type {Array.<string>}
     */
    var prepared = [];

    /**
     * @description collection of queued requests
     * @memberOf EquivalentJS.Manager
     * @private
     * @type {jQuery}
     */
    var $requests = $({});

    /**
     * @description set module type before autoload can do this
     * @memberOf EquivalentJS.Manager
     * @type {string}
     * @default
     */
    _.type = 'EquivalentJS.Manager';

    /**
     * @description stored modules in DIC
     * @memberOf EquivalentJS.Manager
     * @type {EquivalentJS.Manager.Module[]}
     */
    _.modules = [];

    /**
     * @description initialize manager for DIC and autoload
     * @memberOf EquivalentJS.Manager
     * @param {string} uri the module uri path
     * @param {boolean=} testRun if true then manager can be
     *  manually handled by tests
     * @requires module:EquivalentJS
     * @requires module:EquivalentJS/Manager/Extend
     * @requires module:EquivalentJS/Manager/Controller
     * @requires module:EquivalentJS/Manager/App
     */
    _.construct = function (uri, testRun) {
        moduleUri = uri || '';
        testing = testRun || false;

        if (false === testing) {
            _.add([
                EquivalentJS.System.type,
                'EquivalentJS.Plugin'
            ]).done(function () {
                _.add([
                    _.type,
                    'EquivalentJS.Manager.Extend',
                    'EquivalentJS.Manager.Controller',
                    'EquivalentJS.Manager.App'
                ]);
            });
        }
    };

    /**
     * @description register a module into DIC
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {Object} module an object with module class construction parameters
     * @param {string} module.type as module class name
     * @param {Object=} module.parameters an object of construction parameters
     * @returns {(void|Deferred)}
     * @throws {Error} if any module class construct exceptions are thrown
     * @todo refactor too long method {@link EquivalentJS.Manager~register}
     */
    var register = function (module) {
        /**
         * @type {{environment: string, systemTests: boolean, appPath: string}}
         */
        var configuration = EquivalentJS.System.getConfiguration();

        /**
         * @description indicates that the system core module itself will be tested
         * @type {boolean}
         */
        var withSystemTests = configuration.systemTests || false;

        /**
         * @description type as module class name
         * @type {string}
         */
        var type = '';

        if (typeof module !== 'undefined' &&
            typeof module.type !== 'undefined'
        ) {
            type = module.type;
        }

        /* return resolver if module is already called or loaded */
        if (null !== getModule(type)) {
            return $.Deferred(function () {
                var $defer = this;
                $defer.resolve(getModule(type).class);
            });
        } else if ('' !== type && -1 === prepared.indexOf(type)) {
            prepared.push(type);
        } else if ('' !== type &&
            -1 < prepared.indexOf(type) &&
            null === getModule(type)
        ) {
            return $.Deferred(function () {
                var $defer = this;
                _.ready(type, function (module) {
                    $defer.resolve(module);
                });
            });
        }

        if (EquivalentJS.System.type === type) {
            /**
             * @description get module class manager
             * @memberOf EquivalentJS.System
             * @see EquivalentJS.Manager.Module.class.__manager__
             * @return {EquivalentJS.Manager}
             */
            EquivalentJS.System.__manager__ = _;
            _.modules.push(createModule(EquivalentJS.System));
            delete EquivalentJS.System.construct;
            if (true === withSystemTests &&
                true === Boolean(sessionStorage.getItem('runTests'))
            ) {
                test({type: EquivalentJS.System.type}, true);
            }
            return;
        } else if (_.type === type) {
            _.modules.push(createModule(_));
            delete _.construct;
            if (true === withSystemTests &&
                true === Boolean(sessionStorage.getItem('runTests'))
            ) {
                test({type: type}, true);
            }
            return;
        }

        var isAppLoad = false;
        if (false === /^EquivalentJS\./.test(type)) {
            isAppLoad = true;
        } else if ('dev' !== configuration.environment) {
            var moduleDom = getModuleDOM(type);
            if (null !== moduleDom) {
                return $.Deferred(function () {
                    var $defer = this;

                    moduleDom.type = type;

                    /**
                     * @see EquivalentJS.Manager.Module.class.__manager__
                     */
                    moduleDom.__manager__ = _;

                    _.modules.push(createModule(moduleDom));

                    try {
                        moduleDom.construct(module);
                    } catch (error) {
                        EquivalentJS.console.error(error);
                    }

                    delete moduleDom.construct;

                    /**
                     * @description fires to event if module is ready
                     * @fires EquivalentJS.Manager#ready:callback
                     */
                    $(_).trigger('ready:callback', moduleDom);

                    $defer.resolve(moduleDom);
                });
            }
        }

        var namespace = EquivalentJS.System.getNamespace(type);

        var classUri = moduleUri;
        if (true === isAppLoad) {
            classUri = configuration.appPath;
            namespace = type.replace(/^(\w+)\..*/, '$1') + '/' + namespace;
        }

        var cacheBust = false;
        if ('dev' === configuration.environment) {
            cacheBust = true;
        }

        var classPath = namespace;
        if (module.type.indexOf('Plugin\.') > -1 &&
            typeof module.parameters !== 'undefined' &&
            typeof module.parameters.hasOwnProperty('plugin')
        ) {
            var plugin = module.parameters.plugin,
                pluginPath = plugin.name + '/' + plugin.path
            ;

            classPath = classPath
                .replace(/^Plugin\/(.*)/, 'Plugin/' + pluginPath + '/$1');
        }

        var moduleUrl = classUri + '/' +
            classPath + '.js' +
            ((true === cacheBust) ? ('?' + String((new Date()).getTime())) : ''),
            layoutUri = null
        ;

        var request = createRequest(moduleUrl);

        if (false === cacheBust) {
            delete request.beforeSend;
        }

        return registerRequest(request).then(function () {
            /**
             * @type {EquivalentJS.Manager.Module.class}
             */
            var importedClass = getModuleDOM(type);

            if (true === testing) {
                // create a module class as mock for manager in test cases
                importedClass = new importedClass.constructor();
            }

            importedClass.type = type;

            /**
             * @see EquivalentJS.Manager.Module.class.__manager__
             */
            importedClass.__manager__ = _;

            _.modules.push(createModule(importedClass));

            if (typeof importedClass.extend === 'string') {
                return _.add(importedClass.extend); // only pre register module for inheritance
            } else {
                var inheritModule = getModuleByExtend(type);

                if (null !== inheritModule) {
                    var inheritClass = extend(
                        inheritModule.class,
                        importedClass
                    );

                    removeModule(importedClass.type);

                    importedClass = inheritClass;
                    type = importedClass.type;
                }
            }

            if (typeof module.parameters !== 'undefined' &&
                typeof module.parameters.app !== 'undefined' &&
                true === isAppLoad
            ) {
                /**
                 * @see EquivalentJS.Manager.Module.class.__markup__
                 */
                importedClass.__markup__ = module.parameters.app;
            }

            if (null !== (layoutUri = getLayout(importedClass, true))) {
                var $link = $('<link/>').attr({
                    'rel': 'stylesheet',
                    'href': layoutUri
                }).on('load', function () {
                    /**
                     * @description fires to event if layout stylesheet DOM loaded
                     * @memberOf EquivalentJS.Manager.Module.class
                     * @fires EquivalentJS.Manager.Module.class#layout:done
                     */
                    $(importedClass).trigger('layout:done');
                });

                importedClass.__layout__ = $link.get(0);

                $('head').append($link);
            }

            return importedClass;
        })
        .then(function (importedClass) {
            if (typeof importedClass.construct === 'undefined') {
                importedClass.construct = function () {};
            }

            if (typeof importedClass.construct.parentClass === 'function') {
                try {
                    importedClass.construct.parentClass(module);
                } catch (error) {
                    EquivalentJS.console.error(error);
                }
            }

            try {
                importedClass.construct(module);
            } catch (error) {
                EquivalentJS.console.error(error);
            }

            delete importedClass.construct;

            return importedClass;
        })
        .then(function (importedClass) {
            if (true === (EquivalentJS.System.testing || false)) {
                test(module, withSystemTests);
            }

            return importedClass;
        })
        .then(function (importedClass) {
            /**
             * @description fires to event if module is ready
             * @fires EquivalentJS.Manager#ready:callback
             */
            $(_).trigger('ready:callback', importedClass);

            return importedClass;
        })
        .fail(function (error) {
            EquivalentJS.console.error(
                (error.status || '0') + ' ' + (error.statusText || 'Error') +
                ' - Could not load' +
                ((isAppLoad) ? ' app' : '') + ' module "' +
                namespace + '"!'
            );
        });
    };

    /**
     * @description if test runner is activated try to find a test unit
     *  for every module class autoload
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {Object} module an object with module class construction parameters
     * @param {boolean} withSystemTests indicate to include core modules into test runner
     * @returns {void} break on try to run system tests
     *  if configuration systemTests property is false
     * @throws {Error} if module class could not be cloned for test isolation
     * @tutorial TEST_RUNNER
     */
    var test = function (module, withSystemTests) {
        if (true === testing) {return;} // if tests are testing the manager themself

        var isAppLoad = false;
        if (false === /^EquivalentJS\./.test(module.type)) {
            isAppLoad = true;
        }

        var type = module.type,
            parameters = module.parameters
        ;

        var namespace = EquivalentJS.System.getNamespace(type),
            testCase = type.replace(/^(\w+)\./, '$1.test.') + 'Test';

        if (true === isAppLoad) {
            namespace = type.replace(/^(\w+)\..*/, '$1') + '/' + namespace;
        }

        var classPath = namespace;
        if (type.indexOf('Plugin\.') > -1 &&
            typeof parameters === 'object' &&
            typeof parameters.hasOwnProperty('plugin')
        ) {
            var plugin = module.parameters.plugin,
                pluginPath = plugin.name + '/' + plugin.test
            ;

            classPath = classPath
                .replace(/^Plugin\/(.*)/, 'Plugin/' + pluginPath + '/$1');
        }

        var testUrl = moduleUri.replace(/lib/, 'test/lib') +
            '/' + classPath + 'Test.js?' +
            String((new Date()).getTime());

        if (true === isAppLoad) {
            testUrl = testUrl.replace(/lib\/equivalent/, 'app');
        } else if (false === withSystemTests) {
            return; // test runner applies only to apps
        }

        /**
         * @description clone module class as copy from constructor per isolated test method
         * @param {EquivalentJS.Manager.Module.class} moduleClass
         * @returns {EquivalentJS.Manager.Module.class}
         * @throws {Error} module class failed to clone for test
         */
        var clone = function(moduleClass) {
            if (null !== moduleClass) {
                var inheritClass = new moduleClass.constructor();

                inheritClass.type = type;

                if (typeof parameters !== 'undefined' &&
                    true === isAppLoad
                ) {
                    inheritClass.__markup__ = parameters.app;
                }

                return inheritClass;
            } else {
                throw new Error('Can not clone module class "' + type + '" for test!');
            }
        };

        /**
         * @returns {EquivalentJS.Manager}
         */
        var getManagerMock = function () {
            var manager = _,
                mock = new manager.constructor();

            mock.construct(moduleUri, true);

            delete mock.construct;

            return mock;
        };

        registerRequest({url: testUrl})
            .done(function () {
                var moduleClass = getModuleDOM(type),
                    moduleClassTest = getModuleDOM(testCase);

                var $testSetup = $.Deferred(),
                    $testCases = $testSetup.then(function () {
                    if (typeof moduleClassTest.setup === 'function') {
                        var $deferredSetup = moduleClassTest.setup(getManagerMock());

                        if (typeof $deferredSetup === 'object' &&
                            $deferredSetup.hasOwnProperty('promise')
                        ) {
                            return $deferredSetup;
                        }
                    }
                });

                var $testTeardown = $testCases.then(function () {
                    if (0 < Object.keys(moduleClassTest).length) {
                        var hasTestMethods = 0;
                        $.each(moduleClassTest, function (testMethod) {
                            var test = moduleClassTest[testMethod];
                            if (typeof test === 'function' && /^test.*/.test(String(testMethod))) {
                                EquivalentJS.test.Unit.test(testCase + '. ' + testMethod, function (assert) {
                                    try {
                                        return test(assert, clone(moduleClass));
                                    } catch (error) {
                                        EquivalentJS.console.error(error);
                                    }
                                });
                                hasTestMethods++;
                            }
                        });

                        if (0 === hasTestMethods) {
                            EquivalentJS.console.warn('Test "' + testCase + '" has no test methods!');
                        }
                    }
                });

                $testTeardown.done(function () {
                    if (typeof moduleClassTest.teardown === 'function') {
                        var $deferredTeardown = moduleClassTest.teardown();

                        if (typeof $deferredTeardown === 'object' &&
                            $deferredTeardown.hasOwnProperty('promise')
                        ) {
                            return $deferredTeardown;
                        }
                    }
                });

                $testSetup.resolve();
            })
            .fail(function (error) {
                EquivalentJS.console.error(
                    error.status + ' ' + error.statusText +
                    ' - Could not load test for module "' + namespace + '"!'
                );

                var $missingTestsLog = $('.missing-tests-log > ul');
                if (0 < $missingTestsLog.length) {
                    $missingTestsLog.append(
                        $('<li/>').html('Could not load test for module "' + namespace + '"!')
                    );
                }
            });
    };

    /**
     * @description inherit a module from another
     * @memberOf EquivalentJS.Manager
     * @private
     * @see EquivalentJS.Extend
     * @param {EquivalentJS.Manager.Module.class} inheritClass the inherit class
     * @param {EquivalentJS.Manager.Module.class} moduleClass the parent class
     * @returns {?EquivalentJS.Manager.Module.class}
     */
    var extend = function (inheritClass, moduleClass) {
        return EquivalentJS.Manager.Extend.inherit(inheritClass, moduleClass);
    };

    /**
     * @description if module class use a layout then try to autoload the stylesheet
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {EquivalentJS.Manager.Module.class} module the module class
     * @param {boolean} module.layout if module has layout
     * @param {string} module.type as module class name
     * @param {boolean} cacheBust bust the cache to get module stylesheet fresh
     * @returns {?string}
     */
    var getLayout = function (module, cacheBust) {
        cacheBust = cacheBust || false;

        var layoutUri = null;

        if (module.hasOwnProperty('layout') &&
            true === module.layout
        ) {
            /**
             * @type {{environment: string, moduleLayout: string}}
             */
            var configuration = EquivalentJS.System.getConfiguration();

            /**
             * @type {string}
             */
            var namespace = EquivalentJS.System.getNamespace(module.type);

            /**
             * @type {string}
             */
            var layoutClassName = (function (toDashesLowerCase) {
                    return toDashesLowerCase
                        .replace(/\W+/g, '-')
                        .replace(/([a-z\d])([A-Z])/g, '$1-$2')
                        .toLowerCase();
                })(namespace.substr(namespace.lastIndexOf('/') + 1)),
                reNamespace = (namespace.substr(0, namespace.lastIndexOf('/') + 1)) +
                layoutClassName;

            if (false === /^EquivalentJS\./.test(module.type)) {
                reNamespace = module.type.replace(/^(\w+)\..*/, '$1') +
                    '/' + reNamespace;
            }

            if ('dev' !== configuration.environment) {
                cacheBust = false;
            }

            layoutUri = configuration.moduleLayout + '/' +
                reNamespace + '.css' +
                ((true === cacheBust) ? ('?' + String((new Date()).getTime())) : '');

            registerRequest({url: layoutUri, method: 'head'})
                .fail(function (error) {
                    EquivalentJS.console.error(
                        error.status + ' ' + error.statusText +
                        ' - Could not load layout for module "' + namespace + '"!'
                    );
                });
        }

        return layoutUri;
    };

    /**
     * @description create an asynchronous request
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {string} moduleUrl the path to the module class js file
     * @returns {Object} a jquery request object
     */
    var createRequest = function (moduleUrl) {
        return {
            url: moduleUrl,
            // if highlighted as unused property beforeSend bug:
            // https://youtrack.jetbrains.com/issue/WEB-19393
            beforeSend: function(request) {
                request.setRequestHeader(
                    'Cache-Control',
                    'no-cache, no-store, must-revalidate'
                );
                request.setRequestHeader(
                    'Pragma',
                    'no-cache'
                );
                request.setRequestHeader(
                    'Expires',
                    '0'
                );
            }
        };
    };

    /**
     * @description register an asynchronous request
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {Object} request a jQuery ajax request object definition
     * @return {Deferred}
     * @see http://api.jquery.com/jQuery.ajax/
     * @see http://api.jquery.com/jQuery.queue/
     */
    var registerRequest = function(request) {
        var $async,
            $defer = $.Deferred(),
            $resolver = $defer.promise();

        var registerCall = function (pipe) {
            $async = $.ajax(request);
            $async
                .done($defer.resolve)
                .fail($defer.reject)
                .then(pipe, pipe)
            ;
        };

        $requests.queue(registerCall);

        $resolver.abort = function(statusText) {
            if ($async) {
                return $async.abort(statusText);
            }

            var queue = $requests.queue(),
                index = queue.indexOf(registerCall),
                context = request.context || request
            ;

            if (-1 < index) {
                queue.splice(index, 1);
            }

            $defer.rejectWith(
                context,
                [
                    $resolver,
                    statusText,
                    ''
                ]
            );

            return $resolver;
        };

        return $resolver;
    };

    /**
     * @description create a module object around the module class
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {object} module the module class
     * @param {string} module.type as module class name
     * @returns {EquivalentJS.Manager.Module}
     * @throws {Error} if module could not be created
     */
    var createModule = function (module) {
        if (typeof module !== 'object') {
            throw new Error('Could not create module!');
        } else if (typeof module.type !== 'string') {
            throw new Error('The module type property must be of type <string>!');
        }

        /**
         * @description an object which contains the module class object
         *  and the module type string
         * @typedef {Object} EquivalentJS.Manager.Module
         * @type {{type: string, class: EquivalentJS.Manager.Module.class}}
         * @see EquivalentJS.Manager.Module.class
         */
        return {
            "type": module.type,
            "class": module
        };
    };

    /**
     * @description get module from DOM reference
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {string} type as module class name
     * @returns {?EquivalentJS.Manager.Module.class}
     * @throws {Error} if module class is not of type {Object}
     */
    var getModuleDOM = function(type) {
        var classScope = null,
            classPath = type.split('.');

        classScope = window; // set initial DOM crawl pointer

        $(classPath).each(function (i, className) {
            if (className in classScope) {
                classScope = classScope[className];
            }
        });

        if (typeof classScope !== 'object') {
            throw new Error(
                'Could not find module class "' + type + '" as <Object>; got instead "' + typeof classScope + '"'
            );
        }

        if (classScope instanceof Window) {
            classScope = null;
        }

        return classScope;
    };

    /**
     * @description get module from DIC
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {string} type as module class name
     * @returns {?EquivalentJS.Manager.Module}
     */
    var getModule = function (type) {
        var module = null;

        $(_.modules).each(function () {
            var moduleClass = this;
            if (type === moduleClass.type) {
                module = this;
            }
        });

        return module;
    };

    /**
     * @description get module by extend from DIC
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {string} type as module class name
     * @returns {?EquivalentJS.Manager.Module}
     */
    var getModuleByExtend = function (type) {
        var inheritModule = null;

        $(_.modules).each(function () {
            var module = this,
                moduleClass = module.class;

            if (moduleClass.hasOwnProperty('extend') &&
                type === moduleClass.extend
            ) {
                inheritModule = module;
            }
        });

        return inheritModule;
    };

    /**
     * @description remove module from DOM reference;
     *  also if the parent namespace is empty it will be also deleted
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {string} type as module class name
     * @returns {boolean}
     */
    var removeModuleDOM = function(type) {
        var classScope = window,
            classPath = type.split('.'),
            success = false;

        $(classPath).each(function (i, className) {
            if (null !== classScope) {
                if (className in classScope) {
                    if (1 === Object.keys(classScope[className]).length &&
                        classPath.length - 2 === i
                    ) {
                        delete classScope[className];
                        success = true;
                    } else if (classPath.length - 1 === i) {
                        delete classScope[className];
                        success = true;
                    } else {
                        classScope = classScope[className];
                    }
                } else {
                    classScope = null;
                }
            }
        });

        return success;
    };

    /**
     * @description remove module from DIC
     * @memberOf EquivalentJS.Manager
     * @private
     * @param {string} type as module class name
     * @returns {boolean}
     */
    var removeModule = function (type) {
        var success = false,
            layoutUri = null;

        $(_.modules).each(function (i) {
            var module = this;

            if (false === testing) {
                removeModuleDOM(type);
            }

            if (type === module.type) {
                var moduleClass = _.modules[i].class;

                if (null !== (layoutUri = getLayout(moduleClass, false))) {
                    $('head link[href^="' + layoutUri + '"]').remove();
                }

                $(_.modules[i]).off();

                _.modules.splice(i, 1);

                var preparedType = prepared.indexOf(type);
                if (preparedType > -1) {
                    prepared.splice(preparedType);
                }

                success = true;
            }
        });

        return success;
    };

    /**
     * @description ready module;
     *  the callback will be triggered if the named type
     *  of the module class is ready
     * @memberOf EquivalentJS.Manager
     * @param {(string|Array.<string>)} type as module class name
     * @param {function} callback runs after module class is ready
     * @tutorial MODULE_MANAGER
     * @see EquivalentJS.Manager#ready:callback
     * @example DIC.ready('A.namespacePart.ClassName', function (module) {});
     * @example DIC.ready([
     *      'A.namespacePart.ClassNameA',
     *      'A.namespacePart.ClassNameB',
     *      'A.namespacePart.ClassNameC',
     * ], function (module) {});
     */
    _.ready = function (type, callback) {
        /**
         * @description set callback on ready event
         * @memberOf EquivalentJS.Manager.ready
         * @private
         * @param {string} type as module class name
         * @param {function} callback runs after module class is ready
         */
        var onCallback = function (type, callback) {
            /**
             * @description listen to event when module is ready
             * @event EquivalentJS.Manager#ready:callback
             */
            $(_).on('ready:callback', function (event, module) {
                if (type === module.type) {
                    /**
                     * @description the callback runs after module class is ready
                     * @callback EquivalentJS.Manager.ready
                     * @param {EquivalentJS.Manager.Module.class} module the module class
                     */
                    callback(module);
                }
            });
        };

        var onReadyError = function () {
            EquivalentJS.console.error(
                'Parameter "type" must be a <string> or <Array> and "callback" a <function>!'
            );
        };

        if (Array.isArray(type)) {
            $(type).each(function () {
                if (typeof this === 'string' &&
                    typeof callback === 'function'
                ) {
                    if (true === _.has(this)) {
                        callback(_.get(this).class);
                    } else {
                        onCallback(this, callback);
                    }
                } else {
                    onReadyError();
                }
            });
        } else if (typeof type === 'string' &&
            typeof callback === 'function'
        ) {
            if (true === _.has(type)) {
                callback(_.get(type).class);
            } else {
                onCallback(type, callback);
            }
        } else {
            onReadyError();
        }
    };

    /**
     * @description remove module
     * @memberOf EquivalentJS.Manager
     * @param {(string|Array.<string>)} type as module class name
     * @returns {boolean}
     * @example DIC.remove('A.namespacePart.ClassName');
     * @example DIC.remove([
     *      'A.namespacePart.ClassNameA',
     *      'A.namespacePart.ClassNameB',
     *      'A.namespacePart.ClassNameC'
     *  ]);
     * @tutorial MODULE_MANAGER
     */
    _.remove = function (type) {
        var onRemoveError = function (type) {
            EquivalentJS.console.error('Could not remove module "' + type + '".');
        };

        if (Array.isArray(type)) {
            var done = false;
            $(type).each(function () {
                done = removeModule(type);
                if (false === done) {
                    onRemoveError(type);
                }
            });
            return done;
        } else if (typeof type === 'string') {
            return removeModule(type);
        } else {
            onRemoveError(type);
        }
    };

    /**
     * @description add module
     * @memberOf EquivalentJS.Manager
     * @param {(string|Array.<string>|Array.Array.<string, Object>)} type as module class name
     * @param {Object=} parameters an object of construction parameters
     * @returns {Deferred}
     * @example DIC.add('A.namespacePart.ClassName');
     * @example DIC.add('A.namespacePart.ClassName', {})
     *  .done(function (module) {})
     *  .fail(function () {});
     * @example DIC.add([
     *      'A.namespacePart.ClassNameA',
     *      'A.namespacePart.ClassNameB',
     *      'A.namespacePart.ClassNameC'
     * ], {})
     *  .done(function (module) {})
     *  .fail(function () {});
     * @example DIC.add([
     *      ['A.namespacePart.ClassNameA', {}],
     *      ['A.namespacePart.ClassNameB', {}],
     *      ['A.namespacePart.ClassNameC', {}]
     * ])
     *  .done(function (module) {})
     *  .fail(function () {});
     * @tutorial MODULE_MANAGER
     */
    _.add = function (type, parameters) {
        var $resolver,
            onAddError = function (type) {
                EquivalentJS.console.error('Could not add module "' + type + ';' +
                    ' parameter "type" must be a <string> or <Array>!' +
                    ' and "parameters" if given; then as an <Object>'
                );
            };

        if (Array.isArray(type)) {
            $(type).each(function () {
                if (Array.isArray(this)) {
                    if (typeof this[0] === 'string') {
                        $resolver = register({type: this[0], parameters: this[1]});
                    } else {
                        onAddError(this[0]);
                    }
                } else if (typeof this === 'string') {
                    $resolver = register({type: this, parameters: parameters});
                } else {
                    onAddError(this);
                }
            });
        } else if (typeof type === 'string') {
            $resolver = register({type: type, parameters: parameters});
        } else {
            onAddError(type);
        }

        if (typeof $resolver === 'undefined') {
            $resolver = $.Deferred(function () {
                this.reject(); // if nothing resolvable then reject immediately on return
            });
        }

        return $resolver;
    };

    /**
     * @description get module
     * @memberOf EquivalentJS.Manager
     * @param {string} type as module class name
     * @returns {?EquivalentJS.Manager.Module}
     * @example DIC.get('A.namespacePart.ClassName');
     * @tutorial MODULE_MANAGER
     */
    _.get = function (type) {
        return getModule(type);
    };

    /**
     * @description has module
     * @memberOf EquivalentJS.Manager
     * @param {string} type as module class name
     * @returns {boolean}
     * @example DIC.has('A.namespacePart.ClassName');
     * @tutorial MODULE_MANAGER
     */
    _.has = function (type) {
        return null !== getModule(type);
    };
});
