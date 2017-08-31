"use strict";

/** @module EquivalentJs/Manager */

/**
 * @class
 * @classdesc The module manager for dependencies and class autoloads
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.Manager
 * @constructs
 */
EquivalentJs.define('EquivalentJs.Manager', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.Manager
     * @private
     * @alias {EquivalentJs.Manager}
     */
    var _ = this;

    /**
     * @description path to module class root directory will be set on construct
     * @memberOf EquivalentJs.Manager
     * @private
     * @type {string}
     */
    var moduleUri = '';

    /**
     * @description setted true to test the manager by unit tests
     * @memberOf EquivalentJs.Manager
     * @private
     * @type {boolean}
     * @default
     */
    var testing = false;

    /**
     * @description stored type names to prepare modules for DIC
     * @memberOf EquivalentJs.Manager
     * @private
     * @type {Array.<string>}
     */
    var prepared = [];

    /**
     * @description collection of queued requests
     * @memberOf EquivalentJs.Manager
     * @private
     * @type {jQuery}
     */
    var $requests = $({});

    /**
     * @description set module type before autoload can do this
     * @memberOf EquivalentJs.Manager
     * @type {string}
     * @default
     */
    _.type = 'EquivalentJs.Manager';

    /**
     * @description stored modules in DIC
     * @memberOf EquivalentJs.Manager
     * @type {EquivalentJs.Manager.Module[]}
     */
    _.modules = [];

    /**
     * @description initialize manager for DIC and autoload
     * @memberOf EquivalentJs.Manager
     * @param {string} uri the module uri path
     * @param {boolean=} testRun if true then manager can be
     *  manually handled by tests
     * @requires module:EquivalentJs
     * @requires module:EquivalentJs/Manager/Extend
     * @requires module:EquivalentJs/Manager/Controller
     * @requires module:EquivalentJs/Manager/App
     */
    _.construct = function (uri, testRun) {
        moduleUri = uri || '';
        testing = testRun || false;

        if (false === testing) {
            _.add([
                EquivalentJs.System.type,
                _.type,
                'EquivalentJs.Manager.Extend',
                'EquivalentJs.Manager.Controller',
                'EquivalentJs.Manager.App'
            ]);
        }
    };

    /**
     * @description register a module into DIC
     * @memberOf EquivalentJs.Manager
     * @private
     * @param {Object} module an object with module class construction parameters
     * @param {string} module.type as module class name
     * @param {Object=} module.parameters an object of construction parameters
     * @returns {(void|Deferred)}
     * @throws {Error} if any module class construct exceptions are thrown
     * @todo refactor too long method {@link EquivalentJs.Manager~register}
     */
    var register = function (module) {
        /**
         * @type {{systemTests: boolean, appPath: string}}
         */
        var configuration = EquivalentJs.System.getConfiguration();

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

        if (EquivalentJs.System.type === type) {
            /**
             * @description get module class manager
             * @memberOf EquivalentJs.System
             * @see EquivalentJs.Manager.Module.class.__manager__
             * @return {EquivalentJs.Manager}
             */
            EquivalentJs.System.__manager__ = _;
            _.modules.push(createModule(EquivalentJs.System));
            delete EquivalentJs.System.construct;
            if (true === withSystemTests &&
                true === Boolean(sessionStorage.getItem('runTests'))
            ) {
                test({type: EquivalentJs.System.type}, true);
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

        if (false === /^EquivalentJs\./.test(type)) {
            isAppLoad = true;
        }

        var namespace = EquivalentJs.System.getNamespace(type);

        var classUri = moduleUri;
        if (true === isAppLoad) {
            classUri = configuration.appPath;
            namespace = type.replace(/^(\w+)\..*/, '$1') + '/' + namespace;
        }

        var moduleUrl = classUri + '/' +
            namespace + '.js?' +
            String((new Date()).getTime());

        var layoutUri = null;

        var request = createRequest(moduleUrl);

        return registerRequest(request).then(function () {
            /**
             * @type {EquivalentJs.Manager.Module.class}
             */
            var importedClass = getModuleDOM(type);

            if (true === testing && EquivalentJs.Manager.has(type)) {
                // create a module class as mock for manager in test cases
                var mockClass = EquivalentJs.Manager.get(type).class;
                importedClass = new mockClass.constructor();
            }

            importedClass.type = type;

            /**
             * @see EquivalentJs.Manager.Module.class.__manager__
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
                 * @see EquivalentJs.Manager.Module.class.__markup__
                 */
                importedClass.__markup__ = module.parameters.app;
            }

            if (null !== (layoutUri = getLayout(importedClass, true))) {
                var $link = $('<link/>').attr({
                    'rel': 'stylesheet',
                    'href': layoutUri
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
                    EquivalentJs.console.error(error);
                }
            }

            try {
                importedClass.construct(module);
            } catch (error) {
                EquivalentJs.console.error(error);
            }

            delete importedClass.construct;

            return importedClass;
        })
        .then(function (importedClass) {
            if (true === (EquivalentJs.System.testing || false)) {
                test(module, withSystemTests);
            }

            return importedClass;
        })
        .then(function (importedClass) {
            /**
             * @description fires to event if module is ready
             * @fires EquivalentJs.Manager#ready:callback
             */
            $(_).trigger('ready:callback', importedClass);

            return importedClass;
        })
        .fail(function (error) {
            EquivalentJs.console.error(
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
     * @memberOf EquivalentJs.Manager
     * @private
     * @param {Object} module an object with module class construction parameters
     * @param {boolean} withSystemTests indicate to include core modules into test runner
     * @returns {void}
     * @throws {Error} if module class could not be cloned for test isolation
     * @tutorial TEST-RUNNER
     */
    var test = function (module, withSystemTests) {
        if (true === testing) {return;} // if tests are testing the manager themself

        var isAppLoad = false;
        if (false === /^EquivalentJs\./.test(module.type)) {
            isAppLoad = true;
        }

        var type = module.type,
            parameters = module.parameters
        ;

        var namespace = EquivalentJs.System.getNamespace(type),
            testCase = type.replace(/^(\w+)\./, '$1.test.') + 'Test';

        if (true === isAppLoad) {
            namespace = type.replace(/^(\w+)\..*/, '$1') + '/' + namespace;
        }

        var testUrl = moduleUri.replace(/lib/, 'test/lib') +
            '/' + namespace + 'Test.js?' +
            String((new Date()).getTime());

        if (true === isAppLoad) {
            testUrl = testUrl.replace(/lib\/equivalent/, 'app');
        } else if (false === withSystemTests) {
            return; // test runner applies only to apps
        }

        /**
         * @description clone module class as copy from constructor per isolated test method
         * @param {EquivalentJs.Manager.Module.class} moduleClass
         * @returns {EquivalentJs.Manager.Module.class}
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
         * @returns {EquivalentJs.Manager}
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
                                EquivalentJs.test.Unit.test(testCase + '. ' + testMethod, function (assert) {
                                    try {
                                        return test(assert, clone(moduleClass));
                                    } catch (error) {
                                        EquivalentJs.console.error(error);
                                    }
                                });
                                hasTestMethods++;
                            }
                        });

                        if (0 === hasTestMethods) {
                            EquivalentJs.console.warn('Test "' + testCase + '" has no test methods!');
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
                EquivalentJs.console.error(
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
     * @memberOf EquivalentJs.Manager
     * @private
     * @see EquivalentJs.Extend
     * @param {EquivalentJs.Manager.Module.class} inheritClass the inherit class
     * @param {EquivalentJs.Manager.Module.class} moduleClass the parent class
     * @returns {?EquivalentJs.Manager.Module.class}
     */
    var extend = function (inheritClass, moduleClass) {
        return EquivalentJs.Manager.Extend.inherit(inheritClass, moduleClass);
    };

    /**
     * @description if module class use a layout then try to autoload the stylesheet
     * @memberOf EquivalentJs.Manager
     * @private
     * @param {EquivalentJs.Manager.Module.class} module the module class
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
             * @type {{moduleLayout: string}}
             */
            var configuration = EquivalentJs.System.getConfiguration();

            /**
             * @type {string}
             */
            var namespace = EquivalentJs.System.getNamespace(module.type);

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

            if (false === /^EquivalentJs\./.test(module.type)) {
                reNamespace = module.type.replace(/^(\w+)\..*/, '$1') +
                    '/' + reNamespace.toLowerCase();
            }

            layoutUri = configuration.moduleLayout + '/' +
                reNamespace + '.css' +
                ((true === cacheBust) ? '?' + String((new Date()).getTime()) : '');

            registerRequest({url: layoutUri, method: 'head'})
                .fail(function (error) {
                    EquivalentJs.console.error(
                        error.status + ' ' + error.statusText +
                        ' - Could not load layout for module "' + namespace + '"!'
                    );
                });
        }

        return layoutUri;
    };

    /**
     * @description create an asynchronous request
     * @memberOf EquivalentJs.Manager
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
     * @memberOf EquivalentJs.Manager
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
     * @memberOf EquivalentJs.Manager
     * @private
     * @param {object} module the module class
     * @param {string} module.type as module class name
     * @returns {EquivalentJs.Manager.Module}
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
         * @typedef {Object} EquivalentJs.Manager.Module
         * @type {{type: string, class: EquivalentJs.Manager.Module.class}}
         * @see EquivalentJs.Manager.Module.class
         */
        return {
            "type": module.type,
            "class": module
        };
    };

    /**
     * @description get module from DOM reference
     * @memberOf EquivalentJs.Manager
     * @private
     * @param {string} type as module class name
     * @returns {?EquivalentJs.Manager.Module.class}
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
     * @memberOf EquivalentJs.Manager
     * @private
     * @param {string} type as module class name
     * @returns {?EquivalentJs.Manager.Module}
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
     * @memberOf EquivalentJs.Manager
     * @private
     * @param {string} type as module class name
     * @returns {?EquivalentJs.Manager.Module}
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
     * @memberOf EquivalentJs.Manager
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
     * @memberOf EquivalentJs.Manager
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
     * @memberOf EquivalentJs.Manager
     * @param {(string|Array.<string>)} type as module class name
     * @param {function} callback runs after module class is ready
     * @tutorial MODULE-MANAGER
     * @see EquivalentJs.Manager#ready:callback
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
         * @memberOf EquivalentJs.Manager.ready
         * @private
         * @param {string} type as module class name
         * @param {function} callback runs after module class is ready
         */
        var onCallback = function (type, callback) {
            /**
             * @description listen to event when module is ready
             * @event EquivalentJs.Manager#ready:callback
             */
            $(_).on('ready:callback', function (event, module) {
                if (type === module.type) {
                    /**
                     * @description the callback runs after module class is ready
                     * @callback EquivalentJs.Manager.ready
                     * @param {EquivalentJs.Manager.Module.class} module the module class
                     */
                    callback(module);
                }
            });
        };

        var onReadyError = function () {
            EquivalentJs.console.error(
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
     * @memberOf EquivalentJs.Manager
     * @param {(string|Array.<string>)} type as module class name
     * @returns {boolean}
     * @example DIC.remove('A.namespacePart.ClassName');
     * @example DIC.remove([
     *      'A.namespacePart.ClassNameA',
     *      'A.namespacePart.ClassNameB',
     *      'A.namespacePart.ClassNameC'
     *  ]);
     * @tutorial MODULE-MANAGER
     */
    _.remove = function (type) {
        var onRemoveError = function (type) {
            EquivalentJs.console.error('Could not remove module "' + type + '".');
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
     * @memberOf EquivalentJs.Manager
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
     * @tutorial MODULE-MANAGER
     */
    _.add = function (type, parameters) {
        var $resolver,
            onAddError = function (type) {
                EquivalentJs.console.error('Could not add module "' + type + ';' +
                    ' parameter "type" must be a <string> or <Array>!' +
                    ' and "parameters" if given; then as an <Object>'
                );
            };

        if (Array.isArray(type)) {
            $(type).each(function () {
                if (Array.isArray(this)) {
                    if (typeof this[0] === 'string' && typeof this[1] === 'object') {
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
     * @memberOf EquivalentJs.Manager
     * @param {string} type as module class name
     * @returns {?EquivalentJs.Manager.Module}
     * @example DIC.get('A.namespacePart.ClassName');
     * @tutorial MODULE-MANAGER
     */
    _.get = function (type) {
        return getModule(type);
    };

    /**
     * @description has module
     * @memberOf EquivalentJs.Manager
     * @param {string} type as module class name
     * @returns {boolean}
     * @example DIC.has('A.namespacePart.ClassName');
     * @tutorial MODULE-MANAGER
     */
    _.has = function (type) {
        return null !== getModule(type);
    };
});
