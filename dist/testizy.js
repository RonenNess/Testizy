(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Testizy = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Implement the testing methods.
 * Author: Ronen Ness.
 * Created: 2022.
 * License: MIT.
 * 
*/
'use strict';
const TestFailedException = require('./test_failed_exception');

/**
 * Assert class - provide the testing methods.
 * This class implements a set of comparison / testing methods, that raise `TestFailedException` exception if condition is not met.
 * That unique exception is than caught by the test suite to mark the test as a failure.
 */
class Assert
{
    /**
     * Perform strict equals comparison.
     * Handle all basic types (numbers, boolean, undefined, dates, array, dictionary, etc.) and perform recursive checks.
     * If objects implement 'equals' method, will use it.
     * @param {*} actual Actual value.
     * @param {*} expected Expected value.
     * @param {String} reason Optional error reason.
     */
    equals(actual, expected, reason)
    {
        if (!compareObjects(actual, expected)) {
            reason = reason || `${repr(actual)} and ${repr(expected)} are not equal`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Perform strict not-equals comparison.
     * Handle all basic types (numbers, boolean, undefined, dates, array, dictionary, etc.) and perform recursive checks.
     * If objects implement 'equals' method, will use it.
     * @param {*} actual Actual value.
     * @param {*} expected Expected value.
     * @param {String} reason Optional error reason.
     */
    notEquals(actual, expected, reason)
    {
        if (compareObjects(actual, expected)) {
            reason = reason || `${repr(actual)} and ${repr(expected)} are equal`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Perform a simple loose equals using the == operator.
     * @param {*} actual Actual value.
     * @param {*} expected Expected value.
     * @param {String} reason Optional error reason.
     */
    looseEquals(actual, expected, reason)
    {
        if (actual != expected) {
            reason = reason || `${repr(actual)} != ${repr(expected)}`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Perform a simple loose equals using the == operator.
     * @param {*} actual Actual value.
     * @param {*} expected Expected value.
     * @param {String} reason Optional error reason.
     */
    looseNotEquals(actual, expected, reason)
    {
        if (actual == expected) {
            reason = reason || `${repr(actual)} == ${repr(expected)}`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Fail the test without condition.
     * @param {String} reason Optional error reason.
     */
    fail(reason)
    {
        reason = reason || `'fail()' was called`;
        throw new TestFailedException(reason);
    }

    /**
     * Make sure given value translates to Boolean true.
     * @param {*} actual Actual value to check.
     * @param {String} reason Optional error reason.
     */
    true(actual, reason)
    {
        if (!Boolean(actual)) {
            reason = reason || `Boolean(${repr(actual)}) is not true`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Make sure given value translates to Boolean false.
     * @param {*} actual Actual value to check.
     * @param {String} reason Optional error reason.
     */
    false(actual, reason)
    {
        if (Boolean(actual)) {
            reason = reason || `Boolean(${repr(actual)}) is not false`;
            throw new TestFailedException(reason);
        }
    }
    
    /**
     * Check if values are the same using Object.is().
     * @param {*} actual Actual value to check.
     * @param {*} expected Expected value.
     * @param {String} reason Optional error reason.
     */
    is(actual, expected, reason)
    {
        if (!Object.is(actual, expected)) {
            reason = reason || `Object.is(${repr(actual)}, ${repr(expected)}) is false`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Call a given method and expect a given exception (or any if 'errorType' is not defined).
     * @param {*} method Method to call and expect exception from.
     * @param {*} errorType Optional error type to except (if not defined, will except any).
     * @param {String} reason Optional error reason.
     */
    except(method, errorType, reason)
    {
        // sanity
        if (typeof method !== 'function') {
            throw new Error("'method' must be a function!");
        }

        // run test
        let gotException;
        try {
            method();
            gotException = false;
        }
        // handle exceptions
        catch (e) {
            gotException = true;
            if (errorType && e.constructor !== errorType) {
                reason = reason || `Expected ${errorType.name || repr(errorType)}, but got error of type ${e.constructor.name || repr(expected)}) instead`;
                throw new TestFailedException(reason);
            }
        }

        if (!gotException) {
            reason = reason || `Expected an exception but didn't get any`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Check if a value is not null / undefined, but is empty.
     * Can handle any object that has 'length' or 'size', or return a valid value from Object.keys() or Object.entries().
     * @param {*} actual Actual value to check.
     * @param {String} reason Optional error reason.
     */
    empty(actual, reason)
    {
        // make sure not null or undefined
        if (!actual) {
            reason = reason || `Object is null or undefined.`;
            throw new TestFailedException(reason);
        }

        // make sure suitable for test
        if ((actual.size === undefined) && (actual.length === undefined) && !(actual instanceof Object)) {
            reason = reason || `Object type is not suitable for 'empty' check.`;
            throw new TestFailedException(reason);
        }

        // check if empty
        if (!isEmpty(actual)) {
            reason = reason || `Object is not empty.`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Check if a value is not null / undefined, and is not empty.
     * Can handle any object that has 'length' or 'size', or return a valid value from Object.keys() or Object.entries().
     * @param {*} actual Actual value to check.
     * @param {String} reason Optional error reason.
     */
    notEmpty(actual, reason)
    {
        // make sure not null or undefined
        if (!actual) {
            reason = reason || `Object is null or undefined.`;
            throw new TestFailedException(reason);
        }

        // make sure suitable for test
        if ((actual.size === undefined) && (actual.length === undefined) && !(actual instanceof Object)) {
            reason = reason || `Object type is not suitable for 'notEmpty' check.`;
            throw new TestFailedException(reason);
        }

        // check if empty
        if (isEmpty(actual)) {
            reason = reason || `Object is empty.`;
            throw new TestFailedException(reason);
        }
    }

    /**
     * Check if value is an instance of type.
     * @param {*} actual Actual value to check.
     * @param {*} type Object to check if value is instance of.
     * @param {String} reason Optional error reason.
     */
    instanceOf(actual, type, reason)
    {
        // special checks
        if (type === Number) {
            if (typeof actual !== 'number') {
                reason = reason || `${repr(actual)} is not instanceof ${type.name || repr(type)}`;
                throw new TestFailedException(reason);
            }
            return;
        }
        if (type === Boolean) {
            if (typeof actual !== 'boolean') {
                reason = reason || `${repr(actual)} is not instanceof ${type.name || repr(type)}`;
                throw new TestFailedException(reason);
            }
            return;
        }
        if (type === String) {
            if (typeof actual !== 'string') {
                reason = reason || `${repr(actual)} is not instanceof ${type.name || repr(type)}`;
                throw new TestFailedException(reason);
            }
            return;
        }
        if (type === Function) {
            if (typeof actual !== 'function') {
                reason = reason || `${repr(actual)} is not instanceof ${type.name || repr(type)}`;
                throw new TestFailedException(reason);
            }
            return;
        }
        if (type === undefined) {
            if (typeof actual !== 'undefined') {
                reason = reason || `${repr(actual)} is not instanceof ${type.name || repr(type)}`;
                throw new TestFailedException(reason);
            }
            return;
        }

        // default
        if (!(actual instanceof type)) {
            reason = reason || `${repr(actual)} is not instanceof ${type.name || repr(type)}`;
            throw new TestFailedException(reason);
        }
    }
}

/**
 * Get textual representation of a value.
 * @private
 */
function repr(val)
{
    if (typeof val === 'number') {
        return val;
    }

    try {
        return JSON.stringify(val);
    }
    catch(e) {
        return val;
    }
}

/**
 * Check if a given value is empty.
 * @private
 */
function isEmpty(actual)
{
    if ((actual.length === 0) || (actual.size === 0)) {
        return true;
    }
    else if ((typeof actual.length === 'number') || (typeof actual.size === 'number')) {
        return false;
    }
    return (Object.keys(actual).length === 0) && (Object.entries(actual).length === 0);
}

/**
 * Deep compare objects.
 * @private
 */
function compareObjects(o1, o2)
{
    // use 'equals' method
    if (o1 && o1.equals) {
        return o1.equals(o2);
    }
    if (o2 && o2.equals) {
        return o2.equals(o1);
    }

    // compare primitives
    if ((typeof o1 === 'string' || typeof o1 === 'number' || typeof o1 === 'boolean' || o1 === null || o1 === undefined || o1 instanceof Function) ||
        (typeof o2 === 'string' || typeof o2 === 'number' || typeof o2 === 'boolean' || o2 === null || o2 === undefined || o2 instanceof Function)) {
        return o1 === o2;
    }

    // check types
    if (o1 && o2 && o1.constructor !== o2.constructor) {
        return false;
    }

    // date objects
    if (o1 instanceof Date) {
        if (!(o2 instanceof Date)) { return false; }
        return o1.getTime() === o2.getTime();
    }
    if (o2 instanceof Date) {
        if (!(o1 instanceof Date)) { return false; }
        return o2.getTime() === o1.getTime();
    }

    // convert sets to arrays
    if (o1 instanceof Set) { o1 = Array.from(o1); }
    if (o2 instanceof Set) { o2 = Array.from(o2); }

    // compare arrays
    if (o1 instanceof Array || o2 instanceof Array) 
    {
        // one is not array? error
        if (!(o1 instanceof Array) || !(o2 instanceof Array)) {
            return false;
        }

        // different length?
        if (o1.length !== o2.length) {
            return false;
        }

        // compare values
        for (let i = 0; i < o1.length; ++i) {
            if (!compareObjects(o1[i], o2[i])) {
                return false;
            }
        }
    }

    // if we got here we need to iterate object keys.
    // get keys and sort them.
    let keysO1 = Object.keys(o1).sort();
    let keysO2 = Object.keys(o2).sort();

    // different number of keys? not equal.
    if (keysO1.length !== keysO2.length) {
        return false;
    }

    // different key values? not equal.
    for (let i = 0; i < keysO1.length; ++i) {
        if (!compareObjects(keysO1[i], keysO2[i])) {
            return false;
        }
    }

    // iterate keys to compare values in objects recursively
    for (let i = 0; i < keysO1.length; ++i)
    {
        let valo = o1[keysO1[i]];
        let valp = o2[keysO1[i]];
        if (!compareObjects(valo, valp)) {
            return false;
        }
    }
    return true;
}


module.exports = Assert;
},{"./test_failed_exception":3}],2:[function(require,module,exports){
/**
 * A micro, modern framework to run JavaScript tests in browser or nodejs.
 * Author: Ronen Ness.
 * Created: 2022.
 * License: MIT.
 * 
*/
'use strict';
module.exports = require('./testizy');
},{"./testizy":6}],3:[function(require,module,exports){
/**
 * Define an exception we raise when a test fails.
 * Author: Ronen Ness.
 * Created: 2022.
 * License: MIT.
 * 
*/
'use strict';


/**
 * Define an exception for failing test.
 * @param {String} message Test failure exception.
 */
 function TestFailedException(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error) {
        Error.captureStackTrace(this, TestFailedException);
    }
    else {
        this.stack = (new Error()).stack;
    }
    if (typeof this.stack === 'string') {
        this.stack = this.stack.split('\n');
    }
}
TestFailedException.prototype = Object.create(Error.prototype);
TestFailedException.prototype.name = "TestFailedException";
TestFailedException.prototype.constructor = TestFailedException;


module.exports = TestFailedException;
},{}],4:[function(require,module,exports){
/**
 * A class to store test results.
 * Author: Ronen Ness.
 * Created: 2022.
 * License: MIT.
 * 
*/
'use strict';


/**
 * Class to store the test results of a single test suite.
 */
class TestResult
{
    /**
     * Create test results container.
     * @param {TestSuite} suite Test suite we create results for.
     * @param {*} logger Logger handler class.
     */
    constructor(suite, logger)
    {
        this._suite = suite;
        this._results = new Map();
        this._caseStartTime = {};
        this._errors = 0;
        this._success = 0;
        this._casesCount = 0;
        this.logger = logger;
    }

    /**
     * Check if a given test case have results or if its still waiting.
     * @param {String} name Test case name to check.
     * @returns True if have any result for test, false otherwise.
     */
    hasResultFor(name)
    {
        return Boolean(this._results.get(name));
    }

    /**
     * Check if a given test case has an error.
     * @param {String} name Test case name to check.
     * @returns True if have an error, false otherwise.
     */
    isError(name)
    {
        return this.hasResultFor(name) && this._results.get(name).success === false;
    }

    /**
     * Check if a given test case is a success.
     * @param {String} name Test case name to check.
     * @returns True if done and have no errors, false otherwise.
     */
    isSuccess(name)
    {
        return this.hasResultFor(name) && this._results.get(name).success === true;
    }

    /**
     * Get test suite name.
     */
    get testName()
    {
        return this._suite.name;
    }
    
    /**
     * Get test suite description.
     */
    get testDescription()
    {
        return this._suite.description;
    }

    /**
     * Get test results.
     */
    get results()
    {
        return this._results.entries();
    }

    /**
     * Get errors count.
     */
    get errorsCount()
    {
        return this._errors;
    }

    /**
     * Get success count.
     */
    get successCount()
    {
        return this._success;
    }

    /**
     * Get total results count.
     */
    get totalCount()
    {
        return this._casesCount;
    }

    /**
     * Start a test case.
     * @private
     * @param {String} caseName Test case name.
     */
    _startCase(caseName)
    {
        this._casesCount++;
        this._caseStartTime[caseName] = accurateTimestamp();
    }

    /**
     * Add error to test.
     * @private
     * @param {String} caseName Test case name.
     * @param {String} reason Reason for failure.
     * @param {Array<String>} stackTrace Error stack trace.
     */
    _addError(caseName, reason, stackTrace)
    {
        if (!this._results.get(caseName)) {
            let testTime = Math.round((accurateTimestamp() - this._caseStartTime[caseName]) * 1000) / 1000;
            this._results.set(caseName, {success: false, reason: reason, time: testTime, stackTrace: stackTrace || []});
            this.logger.warn(`[Testizy] [${this._suite.name}] Failed: '${reason}'.`);
            this._errors++;
        }
    }
    
    /**
     * Add success to test case unless there was an error.
     * @private
     * @param {String} caseName Test case name.
     */
    _addSuccessIfDidntFail(caseName)
    {
        if (!this._results.get(caseName)) {
            let testTime = Math.round((accurateTimestamp() - this._caseStartTime[caseName]) * 1000) / 1000;
            this._results.set(caseName, {success: true, time: testTime, reason: null});
            this.logger.debug(`[Testizy] [${this._suite.name}] Success.`);
            this._success++;
        }
    }
}


/**
 * Get accurate timestamp in ms.
 * @private
 */
function accurateTimestamp()
{
    if (typeof performance !== 'undefined') {
        return performance.now();
    }
    return (new Date).getTime();
}


module.exports = TestResult;
},{}],5:[function(require,module,exports){
/**
 * Define a test suite (contains a collection of test cases for a specific functionality or module).
 * Author: Ronen Ness.
 * Created: 2022.
 * License: MIT.
 * 
*/
'use strict';
const TestFailedException  = require('./test_failed_exception');
const TestResult = require("./test_result");
const Assert = require("./assert");

/**
 * Represent a test suite.
 */
class TestSuite
{
    /**
     * Create the test suite.
     * @param {String} name Test suite name.
     * @param {*} params Optional additional params. May include:
     *                      - description: test suite textual description.
     * @param {*} logger Logger handler class.
     */
    constructor(name, params, logger)
    {
        this._name = name;
        this._params = params || {};
        this.logger = logger;
        this._cases = new Map();
    }

    /**
     * Get suite name.
     */
    get name()
    {
        return this._name;
    }

    /**
     * Get test suite description.
     */
    get description()
    {
        return this._params.description || "";
    }

    /**
     * Define a test case.
     * @param {String} name Test case name.
     * @param {Function} method Test case implementation method. Get 'Assert' instance as a single parameter.
     * @param {*} params Optional additional params for this test case. May include:
     *                     - timeout: timeout in ms to run the case. defaults to 10000.
     */
    case(name, method, params)
    {
        // log
        this.logger.info(`[Testizy] [${this._name}] Define test case: '${name}'.`);

        // sanity
        if (this._cases.get(name)) {
            throw new Error(`A test case named '${name}' already exists!`);
        }

        // default params
        params = params || {};
        params.timeout = params.timeout || 10000;

        // store case
        this._cases.set(name, {method: method, params: params});
    }

    /**
     * Set a setup method to run before tests.
     * @param {Function} method Setup function to run before tests.
     * @param {Number} timeout Timeout for setup code, in ms (only for async code). Defaults to 10000.
     */
    setup(method, timeout)
    {
        this._setup = {method: method, params: {timeout: timeout || 10000}};
    }

    /**
     * Set a setup method to run after tests.
     * @param {Function} method Teardown function to run after tests.
     * @param {Number} timeout Timeout for teardown code, in ms (only for async code). Defaults to 10000.
     */
    teardown(method, timeout)
    {
        this._teardown = {method: method, params: {timeout: timeout || 10000}};
    }
    
    /**
     * Run this test suite.
     * @returns {Promise<TestResult>} Test results.
     */
    run()
    {
        return new Promise(async (resolve, reject) => {

            // start running test suite
            this.logger.info(`[Testizy] [${this._name}] Start running..`);
            let result = new TestResult(this, this.logger);

            // execute case inside an async method that returns a promise
            // that way we can handle cases that return promises while having a timeout to break them if they don't finish on time
            let execution = async (caseName, testCase, result) => {

                return new Promise(async (resolve, reject) => {
                    try {

                        // start case
                        result._startCase(caseName);

                        // create assert object
                        let assert = new Assert();

                        // run test and get promise (if test indeed returns a promise)
                        let promise = testCase.method(assert);

                        // set timeout to break the case if its async
                        if (promise && testCase.params.timeout) {
                            setTimeout(() => {
                                if (!result.hasResultFor(caseName)) {
                                    result._addError(caseName, `Test did not finish in timely manner (timeout: ${testCase.params.timeout} ms)`, null);
                                    resolve(false);
                                }
                            }, testCase.params.timeout);
                        }

                        // if we got a promise, wait for it
                        if (promise) {
                            await promise;
                        }

                        // success
                        result._addSuccessIfDidntFail(caseName);
                    }
                    // handle exceptions and assert failures
                    catch (e) {

                        // assert failed
                        if (e instanceof TestFailedException) {
                            result._addError(caseName, e.message, e.stack);
                        }
                        // unknown exception
                        else {
                            this.logger.warn(`[Testizy] [${this._name}] Got exception while running test case: '${caseName}'. Exception: ${e}.`);
                            result._addError(caseName, `Exception while running test: ${e}`);
                        }
                    }

                    // return success or failure
                    resolve(result.isSuccess(caseName));
                });
            }

            // run setup code
            if (this._setup) {
                this.logger.debug(`[Testizy] [${this._name}] Run setup code.`);
                let success = await execution('__setup__', this._setup, result);
                if (!success) {
                    this.logger.warn(`[Testizy] [${this._name}] Will not run tests because had an error during setup code.`);
                    resolve(result);
                    return;
                }
            }

            // iterate and execute cases
            for (const [caseName, testCase] of this._cases.entries()) {

                // run test case and await for it to finish, either from timeout or actually finish
                this.logger.debug(`[Testizy] [${this._name}] Run test case: '${caseName}'.`);
                await execution(caseName, testCase, result);
            }

            // run teardown code
            if (this._teardown) {
                this.logger.debug(`[Testizy] [${this._name}] Run teardown code.`);
                let success = await execution('__teardown__', this._teardown, result);
                if (!success) {
                    this.logger.warn(`[Testizy] [${this._name}] Had error in teardown code.`);
                }
            }

            // done!
            this.logger.info(`[Testizy] [${this._name}] Finished all cases. Errors: ${result.errorsCount}, Success: ${result.successCount}.`);
            resolve(result);
        });
    }
}

module.exports = TestSuite;
},{"./assert":1,"./test_failed_exception":3,"./test_result":4}],6:[function(require,module,exports){
/**
 * The main class to run and define tests.
 * Author: Ronen Ness.
 * Created: 2022.
 * License: MIT.
 * 
*/
'use strict';
const TestSuite = require('./test_suite');
const Assert = require('./assert');
const TestFailedException = require('./test_failed_exception');
const TestResult = require('./test_result');

/**
 * The main tests engine class.
 * 
 * @example
 * // create the tests suite.
 * let testizy = new Testizy();
 * 
 * // define a test suite for arithmetic operators.
 * testizy.suite('Arithmetics', (suite) => {
 *   suite.case('1 + 1 = 2', (assert) => {
 *      assert.equals(1 + 1, 2);
 *   });
 * });
 * 
 * // run all tests and render them
 * testizy.run(null, testizy.renderTest);
 */
class Testizy
{
    /**
     * Create the tests engine.
     * @param {*} logger Optional object for Testizy logs. If not set, will use console. If set to null, will not output anything.
     */
    constructor(logger)
    {
        this._tests = new Map();
        if (logger === null) { logger = NullLogger; }
        this.logger = logger || console;
        this.logger.info(`
        ___________              __  .__               
        \\__    ___/___   _______/  |_|__|__________.__.
          |    |_/ __ \\ /  ___/\\   __\\  \\___   <   |  |
          |    |\\  ___/ \\___ \\  |  | |  |/    / \\___  |
          |____| \\___  >____  > |__| |__/_____ \\/ ____|
                     \\/     \\/                \\/\\/     
        
                     A simple, modern, pure JavaScript testing framework.
                     By Ronen Ness, 2022.
                     `);
        this.logger.info(`[Testizy] Created new engine.`);
        this.logger.debug(`[Testizy] Note: set the 'logger' constructor param to null to disable verbose output from Testizy.`);
    }

    /**
     * Create a new test suite.
     * @param {String} name Test suite name.
     * @param {Function} generator Function to define the test suite cases. Receive a single parameter of 'TestSuit' type.
     * @param {*} params Optional additional params.
     * @returns {TestSuite} Newly created test suite.
     */
    suite(name, generator, params)
    {
        // log
        this.logger.info(`[Testizy] Define new test suite: '${name}'`);

        // sanity
        if (this._tests.get(name)) {
            throw new Error(`A test suite named '${name}' already exists!`);
        }

        // create test suite
        let suite = new TestSuite(name, params || {}, this.logger);
        this._tests.set(name, suite);

        // call generator method
        if (generator) {
            generator(suite);
        }

        // return the suite
        return suite;
    }

    /**
     * Run tests.
     * @param {String|Array<String>} tests Optional test suite or list of test suite names to run. Omit to run everything.
     * @param {Function} onTestFinish Optional method to call with (testName, result) every time a test suite finish running.
     * @returns {Promise<Object.<String, TestResult>>} Map with test suite name as key, and test results as value.
     */
    run(tests, onTestFinish)
    {
        return new Promise(async (resolve, reject) => {

            // default tests
            if (!tests) {
                tests = this._tests.keys();
            }
            // if a single test provided, turn to array
            else if (typeof tests === 'string') {
                tests = [tests];
            }

            // convert tests to a set
            tests = new Set(tests);

            // log
            this.logger.info(`[Testizy] Run test suites: '${Array.from(tests).join(',')}'.`);

            // run tests
            let results = new Map();
            for (const [testName, testSuite] of this._tests.entries()) {
                if (tests.has(testName)) {
                    let result = await testSuite.run();
                    results.set(testName, result);
                    if (onTestFinish) {
                        onTestFinish(testName, result);
                    }
                }
            }

            // return results
            this.logger.info(`[Testizy] Finished running tests.`);
            resolve(results);
        });
    }

    /**
     * Inject default CSS rules for testizy classes. 
     */
    injectDefaultCss()
    {
        document.head.insertAdjacentHTML("beforeend", `
            <style>
                .testizy {
                    font-family: Tahoma;
                }
                .testizy-success {
                    color: green;
                }
                .testizy-failed {
                    color: red;
                }
            </style>
        `);
    }

    /**
     * Render test results as HTML elements.
     * @param {Object.<String, TestResult>} results Test results to render.
     * @param {Element} parentDom Optional parent DOM element to render in (will use document.body if not set).
     */
    renderAllTests(results, parentDom)
    {
        this.logger.info(`[Testizy] Render test results..`);
        parentDom = parentDom || document.body;

        parentDom.innerHTML += `<h1 class='testizy-h1'>Tests Results</h1>`;
        for (const [suiteName, suiteResults] of results.entries()) {
            this.renderTest(suiteName, suiteResults);
        }

        this.logger.info(`[Testizy] Done rendering.`);
    }
    
    /**
     * Render a single test results as HTML elements.
     * @param {String} suiteName test suite name.
     * @param {suiteResults} results Test results to render.
     * @param {Element} parentDom Optional parent DOM element to render in (will use document.body if not set).
     */
    renderTest(suiteName, suiteResults, parentDom)
    {
        parentDom = parentDom || document.body;
        let successClass = suiteResults.errorsCount ? 'testizy-failed' : 'testizy-success';
        parentDom.innerHTML += `<h2 class='testizy testizy-h2 ${successClass}'>${suiteName} [${suiteResults.successCount} / ${suiteResults.totalCount}]</h2>`;
        parentDom.innerHTML += `<p class='testizy testizy-p testizy-desc ${successClass}'>${suiteResults.testDescription}</p>`;
        for (const [caseName, caseResult] of suiteResults.results) {
            if (caseResult.success) {
                parentDom.innerHTML += `<p class='testizy testizy-p testizy-success'>✔️ '${caseName}' [${caseResult.time} ms]</p>`;
            }
            else {
                parentDom.innerHTML += `<p class='testizy testizy-p testizy-failed'>❌ '${caseName}' [${caseResult.time} ms]<br /> • Error message: '${caseResult.reason}'<br /> • Origin: ${caseResult.stackTrace[2]}</p>`;
            }
        }
    }

    /**
     * Write all test results to log or console.
     * @param {Object.<String, TestResult>} results Test results to log.
     * @param {Boolean} colors Should we use console colors? Defaults to true.
     * @param {*} _console Console instance to use. Defaults to console.
     */
    logAllTests(results, colors, _console)
    {
        for (const [suiteName, suiteResults] of results.entries()) {
            this.logTest(suiteName, suiteResults, colors, _console);
        }
    }
    
    /**
     * Write a single test result to log or console.
     * @param {String} suiteName Test suite name.
     * @param {TestResult} suiteResults Test result to log.
     * @param {Boolean} colors Should we use console colors? Defaults to true.
     * @param {*} _console Console instance to use. Defaults to console.
     */
    logTest(suiteName, suiteResults, colors, _console)
    {
        _console = _console || console;

        if (colors === undefined) { colors = true; }
        let successClass = colors ? (suiteResults.errorsCount ? "\x1b[31m" : "\x1b[32m") : '';

        _console.log(successClass + `\n\n${suiteName} [${suiteResults.successCount} / ${suiteResults.totalCount}]`);
        _console.log("-----------------------------------------------------------------------------------------");
        _console.log(successClass + `${suiteResults.testDescription}`);

        for (const [caseName, caseResult] of suiteResults.results) {
            if (caseResult.success) {
                _console.log(successClass + `V '${caseName}' [${caseResult.time} ms]`);
            }
            else {
                _console.log(successClass + `X '${caseName}' [${caseResult.time} ms]\n - Error message: '${caseResult.reason}'\n - Origin: ${caseResult.stackTrace[2]}`);
            }
        }

        if (colors) {
            _console.log("\x1b[0m");
        }
    }
}



// Attach the sub-classes to the main Testizy class.
Testizy.TestSuite = TestSuite;
Testizy.TestResult = TestResult;
Testizy.Assert = Assert;
Testizy.TestFailedException = TestFailedException;

// set version
Testizy.version = '1.0.0';


// null logger to hide output
const NullLogger = {
    trace: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {}
}


// for node modules
if (typeof module !== 'undefined') {
    module.exports = Testizy;
}
},{"./assert":1,"./test_failed_exception":3,"./test_result":4,"./test_suite":5}]},{},[2])(2)
});
