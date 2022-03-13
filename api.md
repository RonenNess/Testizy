## Classes

<dl>
<dt><a href="#Assert">Assert</a></dt>
<dd><p>Assert class - provide the testing methods.
This class implements a set of comparison / testing methods, that raise <code>TestFailedException</code> exception if condition is not met.
That unique exception is than caught by the test suite to mark the test as a failure.</p>
</dd>
<dt><a href="#TestResult">TestResult</a></dt>
<dd><p>Class to store the test results of a single test suite.</p>
</dd>
<dt><a href="#TestSuite">TestSuite</a></dt>
<dd><p>Represent a test suite.</p>
</dd>
<dt><a href="#Testizy">Testizy</a></dt>
<dd><p>The main tests engine class.</p>
</dd>
</dl>

<a name="Assert"></a>

## Assert
Assert class - provide the testing methods.This class implements a set of comparison / testing methods, that raise `TestFailedException` exception if condition is not met.That unique exception is than caught by the test suite to mark the test as a failure.

**Kind**: global class  

* [Assert](#Assert)
    * [.equals(actual, expected, reason)](#Assert+equals)
    * [.notEquals(actual, expected, reason)](#Assert+notEquals)
    * [.looseEquals(actual, expected, reason)](#Assert+looseEquals)
    * [.looseNotEquals(actual, expected, reason)](#Assert+looseNotEquals)
    * [.fail(reason)](#Assert+fail)
    * [.true(actual, reason)](#Assert+true)
    * [.false(actual, reason)](#Assert+false)
    * [.is(actual, expected, reason)](#Assert+is)
    * [.isNot(actual, expected, reason)](#Assert+isNot)
    * [.except(method, errorType, reason)](#Assert+except)
    * [.empty(actual, reason)](#Assert+empty)
    * [.notEmpty(actual, reason)](#Assert+notEmpty)
    * [.instanceOf(actual, type, reason)](#Assert+instanceOf)
    * [.wait(timeMs, comment)](#Assert+wait)

<a name="Assert+equals"></a>

### assert.equals(actual, expected, reason)
Perform strict equals comparison.Handle all basic types (numbers, boolean, undefined, dates, array, dictionary, etc.) and perform recursive checks.If objects implement 'equals' method, will use it.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value. |
| expected | <code>\*</code> | Expected value. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+notEquals"></a>

### assert.notEquals(actual, expected, reason)
Perform strict not-equals comparison.Handle all basic types (numbers, boolean, undefined, dates, array, dictionary, etc.) and perform recursive checks.If objects implement 'equals' method, will use it.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value. |
| expected | <code>\*</code> | Expected value. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+looseEquals"></a>

### assert.looseEquals(actual, expected, reason)
Perform a simple loose equals using the == operator.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value. |
| expected | <code>\*</code> | Expected value. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+looseNotEquals"></a>

### assert.looseNotEquals(actual, expected, reason)
Perform a simple loose equals using the == operator.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value. |
| expected | <code>\*</code> | Expected value. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+fail"></a>

### assert.fail(reason)
Fail the test without condition.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+true"></a>

### assert.true(actual, reason)
Make sure given value translates to Boolean true.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value to check. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+false"></a>

### assert.false(actual, reason)
Make sure given value translates to Boolean false.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value to check. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+is"></a>

### assert.is(actual, expected, reason)
Check if values are the same using Object.is().

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value to check. |
| expected | <code>\*</code> | Expected value. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+isNot"></a>

### assert.isNot(actual, expected, reason)
Check if values are not the same using !Object.is().

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value to check. |
| expected | <code>\*</code> | Expected value. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+except"></a>

### assert.except(method, errorType, reason)
Call a given method and expect a given exception (or any if 'errorType' is not defined).

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>\*</code> | Method to call and expect exception from. |
| errorType | <code>\*</code> | Optional error type to except (if not defined, will except any). |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+empty"></a>

### assert.empty(actual, reason)
Check if a value is not null / undefined, but is empty.Can handle any object that has 'length' or 'size', or return a valid value from Object.keys() or Object.entries().

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value to check. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+notEmpty"></a>

### assert.notEmpty(actual, reason)
Check if a value is not null / undefined, and is not empty.Can handle any object that has 'length' or 'size', or return a valid value from Object.keys() or Object.entries().

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value to check. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+instanceOf"></a>

### assert.instanceOf(actual, type, reason)
Check if value is an instance of type.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | Actual value to check. |
| type | <code>\*</code> | Object to check if value is instance of. |
| reason | <code>String</code> | Optional error reason. |

<a name="Assert+wait"></a>

### assert.wait(timeMs, comment)
Create a promise and resolve it after given time, used to create sleeping time in test cases.

**Kind**: instance method of [<code>Assert</code>](#Assert)  

| Param | Type | Description |
| --- | --- | --- |
| timeMs | <code>Number</code> | Time to sleep, in ms. |
| comment | <code>String</code> | Optional waiting comment. |

**Example**  
```js
await assert.sleep(1000, 'Wait for one second.');
```
<a name="TestResult"></a>

## TestResult
Class to store the test results of a single test suite.

**Kind**: global class  

* [TestResult](#TestResult)
    * [new TestResult(suite, logger)](#new_TestResult_new)
    * [.testName](#TestResult+testName)
    * [.testDescription](#TestResult+testDescription)
    * [.results](#TestResult+results)
    * [.errorsCount](#TestResult+errorsCount)
    * [.successCount](#TestResult+successCount)
    * [.totalCount](#TestResult+totalCount)
    * [.hasResultFor(name)](#TestResult+hasResultFor) ⇒
    * [.isError(name)](#TestResult+isError) ⇒
    * [.isSuccess(name)](#TestResult+isSuccess) ⇒

<a name="new_TestResult_new"></a>

### new TestResult(suite, logger)
Create test results container.


| Param | Type | Description |
| --- | --- | --- |
| suite | [<code>TestSuite</code>](#TestSuite) | Test suite we create results for. |
| logger | <code>\*</code> | Logger handler class. |

<a name="TestResult+testName"></a>

### testResult.testName
Get test suite name.

**Kind**: instance property of [<code>TestResult</code>](#TestResult)  
<a name="TestResult+testDescription"></a>

### testResult.testDescription
Get test suite description.

**Kind**: instance property of [<code>TestResult</code>](#TestResult)  
<a name="TestResult+results"></a>

### testResult.results
Get test results.

**Kind**: instance property of [<code>TestResult</code>](#TestResult)  
<a name="TestResult+errorsCount"></a>

### testResult.errorsCount
Get errors count.

**Kind**: instance property of [<code>TestResult</code>](#TestResult)  
<a name="TestResult+successCount"></a>

### testResult.successCount
Get success count.

**Kind**: instance property of [<code>TestResult</code>](#TestResult)  
<a name="TestResult+totalCount"></a>

### testResult.totalCount
Get total results count.

**Kind**: instance property of [<code>TestResult</code>](#TestResult)  
<a name="TestResult+hasResultFor"></a>

### testResult.hasResultFor(name) ⇒
Check if a given test case have results or if its still waiting.

**Kind**: instance method of [<code>TestResult</code>](#TestResult)  
**Returns**: True if have any result for test, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Test case name to check. |

<a name="TestResult+isError"></a>

### testResult.isError(name) ⇒
Check if a given test case has an error.

**Kind**: instance method of [<code>TestResult</code>](#TestResult)  
**Returns**: True if have an error, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Test case name to check. |

<a name="TestResult+isSuccess"></a>

### testResult.isSuccess(name) ⇒
Check if a given test case is a success.

**Kind**: instance method of [<code>TestResult</code>](#TestResult)  
**Returns**: True if done and have no errors, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Test case name to check. |

<a name="TestSuite"></a>

## TestSuite
Represent a test suite.

**Kind**: global class  

* [TestSuite](#TestSuite)
    * [new TestSuite(name, params, logger)](#new_TestSuite_new)
    * [.name](#TestSuite+name)
    * [.description](#TestSuite+description)
    * [.case(name, method, params)](#TestSuite+case)
    * [.setup(method, timeout)](#TestSuite+setup)
    * [.teardown(method, timeout)](#TestSuite+teardown)
    * [.wait(time, reason)](#TestSuite+wait)
    * [.run()](#TestSuite+run) ⇒ [<code>Promise.&lt;TestResult&gt;</code>](#TestResult)

<a name="new_TestSuite_new"></a>

### new TestSuite(name, params, logger)
Create the test suite.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Test suite name. |
| params | <code>\*</code> | Optional additional params. May include:                      - description: test suite textual description. |
| logger | <code>\*</code> | Logger handler class. |

<a name="TestSuite+name"></a>

### testSuite.name
Get suite name.

**Kind**: instance property of [<code>TestSuite</code>](#TestSuite)  
<a name="TestSuite+description"></a>

### testSuite.description
Get test suite description.

**Kind**: instance property of [<code>TestSuite</code>](#TestSuite)  
<a name="TestSuite+case"></a>

### testSuite.case(name, method, params)
Define a test case.

**Kind**: instance method of [<code>TestSuite</code>](#TestSuite)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Test case name. |
| method | <code>function</code> | Test case implementation method. Get 'Assert' instance as a single parameter. |
| params | <code>\*</code> | Optional additional params for this test case. May include:                     - timeout: timeout in ms to run the case. defaults to 10000. |

<a name="TestSuite+setup"></a>

### testSuite.setup(method, timeout)
Set a setup method to run before tests.

**Kind**: instance method of [<code>TestSuite</code>](#TestSuite)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>function</code> | Setup function to run before tests. |
| timeout | <code>Number</code> | Timeout for setup code, in ms (only for async code). Defaults to 10000. |

<a name="TestSuite+teardown"></a>

### testSuite.teardown(method, timeout)
Set a setup method to run after tests.

**Kind**: instance method of [<code>TestSuite</code>](#TestSuite)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>function</code> | Teardown function to run after tests. |
| timeout | <code>Number</code> | Timeout for teardown code, in ms (only for async code). Defaults to 10000. |

<a name="TestSuite+wait"></a>

### testSuite.wait(time, reason)
Create an artifical delay between test cases.This will generate a "test case" that just waits for the given time.

**Kind**: instance method of [<code>TestSuite</code>](#TestSuite)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>Number</code> | How long to wait, in milliseconds. |
| reason | <code>String</code> | Waiting reason, will appear as case name. |

<a name="TestSuite+run"></a>

### testSuite.run() ⇒ [<code>Promise.&lt;TestResult&gt;</code>](#TestResult)
Run this test suite.

**Kind**: instance method of [<code>TestSuite</code>](#TestSuite)  
**Returns**: [<code>Promise.&lt;TestResult&gt;</code>](#TestResult) - Test results.  
<a name="Testizy"></a>

## Testizy
The main tests engine class.

**Kind**: global class  

* [Testizy](#Testizy)
    * [new Testizy(logger)](#new_Testizy_new)
    * [.suite(name, generator, params)](#Testizy+suite) ⇒ [<code>TestSuite</code>](#TestSuite)
    * [.run(tests, onTestFinish)](#Testizy+run) ⇒ <code>Promise.&lt;Object.&lt;String, TestResult&gt;&gt;</code>
    * [.injectDefaultCss()](#Testizy+injectDefaultCss)
    * [.renderAllTests(results, parentDom)](#Testizy+renderAllTests)
    * [.renderTest(suiteName, results, parentDom)](#Testizy+renderTest)
    * [.logAllTests(results, colors, _console)](#Testizy+logAllTests)
    * [.logTest(suiteName, suiteResults, colors, _console)](#Testizy+logTest)

<a name="new_Testizy_new"></a>

### new Testizy(logger)
Create the tests engine.


| Param | Type | Description |
| --- | --- | --- |
| logger | <code>\*</code> | Optional object for Testizy logs. If not set, will use console. If set to null, will not output anything. |

**Example**  
```js
// create the tests suite.let testizy = new Testizy();// define a test suite for arithmetic operators.testizy.suite('Arithmetics', (suite) => {  suite.case('1 + 1 = 2', (assert) => {     assert.equals(1 + 1, 2);  });});// run all tests and render themtestizy.run(null, testizy.renderTest);
```
<a name="Testizy+suite"></a>

### testizy.suite(name, generator, params) ⇒ [<code>TestSuite</code>](#TestSuite)
Create a new test suite.

**Kind**: instance method of [<code>Testizy</code>](#Testizy)  
**Returns**: [<code>TestSuite</code>](#TestSuite) - Newly created test suite.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Test suite name. |
| generator | <code>function</code> | Function to define the test suite cases. Receive a single parameter of 'TestSuit' type. |
| params | <code>\*</code> | Optional additional params. |

<a name="Testizy+run"></a>

### testizy.run(tests, onTestFinish) ⇒ <code>Promise.&lt;Object.&lt;String, TestResult&gt;&gt;</code>
Run tests.

**Kind**: instance method of [<code>Testizy</code>](#Testizy)  
**Returns**: <code>Promise.&lt;Object.&lt;String, TestResult&gt;&gt;</code> - Map with test suite name as key, and test results as value.  

| Param | Type | Description |
| --- | --- | --- |
| tests | <code>String</code> \| <code>Array.&lt;String&gt;</code> | Optional test suite or list of test suite names to run. Omit to run everything. |
| onTestFinish | <code>function</code> | Optional method to call with (testName, result) every time a test suite finish running. |

<a name="Testizy+injectDefaultCss"></a>

### testizy.injectDefaultCss()
Inject default CSS rules for testizy classes.

**Kind**: instance method of [<code>Testizy</code>](#Testizy)  
<a name="Testizy+renderAllTests"></a>

### testizy.renderAllTests(results, parentDom)
Render test results as HTML elements.

**Kind**: instance method of [<code>Testizy</code>](#Testizy)  

| Param | Type | Description |
| --- | --- | --- |
| results | <code>Object.&lt;String, TestResult&gt;</code> | Test results to render. |
| parentDom | <code>Element</code> | Optional parent DOM element to render in (will use document.body if not set). |

<a name="Testizy+renderTest"></a>

### testizy.renderTest(suiteName, results, parentDom)
Render a single test results as HTML elements.

**Kind**: instance method of [<code>Testizy</code>](#Testizy)  

| Param | Type | Description |
| --- | --- | --- |
| suiteName | <code>String</code> | test suite name. |
| results | <code>suiteResults</code> | Test results to render. |
| parentDom | <code>Element</code> | Optional parent DOM element to render in (will use document.body if not set). |

<a name="Testizy+logAllTests"></a>

### testizy.logAllTests(results, colors, _console)
Write all test results to log or console.

**Kind**: instance method of [<code>Testizy</code>](#Testizy)  

| Param | Type | Description |
| --- | --- | --- |
| results | <code>Object.&lt;String, TestResult&gt;</code> | Test results to log. |
| colors | <code>Boolean</code> | Should we use console colors? Defaults to true. |
| _console | <code>\*</code> | Console instance to use. Defaults to console. |

<a name="Testizy+logTest"></a>

### testizy.logTest(suiteName, suiteResults, colors, _console)
Write a single test result to log or console.

**Kind**: instance method of [<code>Testizy</code>](#Testizy)  

| Param | Type | Description |
| --- | --- | --- |
| suiteName | <code>String</code> | Test suite name. |
| suiteResults | [<code>TestResult</code>](#TestResult) | Test result to log. |
| colors | <code>Boolean</code> | Should we use console colors? Defaults to true. |
| _console | <code>\*</code> | Console instance to use. Defaults to console. |

