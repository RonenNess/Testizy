# Testizy

*Testizy* is a micro (15kb), easy-to-use and modern testing framework for JavaScript. It's suitable for both client and server side.

Writing tests with *Testizy* takes seconds:

```js
// init testizy (injectDefaultCss will set default css rules for test results)
let testizy = new Testizy();
testizy.injectDefaultCss();

// create a basic test suite with setup, teardown and a single case
testizy.suite('Example test suite', (suite) => {

    suite.setup(() => {
        window._setupCheck = true;
    });

    suite.case('make sure the setup code executed.', (assert) => {
        assert.true(window._setupCheck);
    });

    suite.teardown(() => {
        delete window._setupCheck;
    });

}, {description: "This is just an example test suite with setup, a single test case, and teardown code."});

// run tests
testizy.run(null, testizy.renderTest);
```

* Live demo can be found [here](https://ronenness.github.io/Testizy/examples_browser.html).
* Full API docs can be found [here](https://ronenness.github.io/Testizy/api.html).

## Why?

There are plenty of JavaScript test frameworks out there, from *mocha* to *jest*. They are all nice, so why making another one?

- I wanted a robust 'equals' method that cover all cases (described later).
- I wanted something that really takes 2 seconds to setup, with minimal dependencies. 
- For fun, really.


## Check It Out

You can check out *Testizy* in browser by opening file `examples_browser.html`, or test in in *NodeJS* by running ```node examples_node.js``` from shell.

# Getting Started

## Browser

To use *Testizy* in browser, you can install it via *npm*:

```$ npm install --save-dev testizy```

Or fetch the built files directly from `dist/`.

Then create an HTML from the following template (a working Html template file can be found at `dist/template.html`):

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Testizy Example</title>
    <!-- adjust path to testizy.js based on where you serve it from -->
    <script src="testizy.js"></script> 
  </head>
  <body style="padding:2em">

    <script>
      // init testizy
      let testizy = new Testizy();
      testizy.injectDefaultCss();

      // create a basic test suite with setup, teardown and a single case
      testizy.suite('Example test suite', (suite) => {

        suite.setup(() => {
            window._setupCheck = true;
        });

        suite.case('make sure the setup code executed.', (assert) => {
            assert.true(window._setupCheck);
        });

        suite.teardown(() => {
            delete window._setupCheck;
        });

      }, {description: "This is just an example test suite with setup, a single test case, and teardown code."});

      // run tests
      testizy.run(null, testizy.renderTest);
    </script>

  </body>
</html>
```

## NodeJS

To use *Testizy* in *NodeJS*, first install it via *npm*:

```$ npm install --save-dev testizy```

Then create a test script from the following template:

```js
// init testizy
// the `null` param will disable the console output. remove the null if you want verbose mode, or provide your own console-like object for custom logs
const Testizy = require('testizy');
let testizy = new Testizy(null);

// create a basic test suite with setup, teardown and a single case
testizy.suite('Example test suite', (suite) => {

    suite.setup(() => {
        window._setupCheck = true;
    });

    suite.case('make sure the setup code executed.', (assert) => {
        assert.true(window._setupCheck);
    });

    suite.teardown(() => {
        delete window._setupCheck;
    });

}, {description: "This is just an example test suite with setup, a single test case, and teardown code."});

// run tests
let runTests = async () => {
    let results = await testizy.run();
    testizy.logAllTests(results, true, console);
}
runTests();
```

And run it from node to run your tests.

# Writing Tests

A full API doc, generated directly from code, can be found [here](api.md).

Before we cover the different classes, lets highlight the main objects we'll deal with:

- **Testizy** is the main object that run the tests.
- **TestSuite** defines a set of test cases revolving around a specific functionality or aspect of your code.
- **TestCase** defines a single test case to run as part of a suite.
- **Assert** is an object with methods to perform checks and fail the test case if condition is not met.

So the general process of writing tests is:

1. Init an instance of *Testizy*.
2. Define test suites.
3. Add test cases which will utilize `assert` to test stuff.

## Init Testizy

To init *Testizy* simply create an instance:

```js
let testizy = new Testizy(logger);
```

The `logger` param will define how testizy will write logs while running the tests:

- Don't set at all to let *Testizy* use `console`.
- Set to null to silent *Testizy*.
- Or provide any object that implements `debug()`, `info()`, `warn()` and `error()` to make *Testizy* use it.

### Init CSS Rules

If you run on browser, you can set the default css rules for the test results with the following command:

```js
testizy.injectDefaultCss();
```

## Define Test Suites

Now lets define a `Test Suite`. As a reminder, a test suite is a set of test cases revolving around a common subject:

```js
testizy.suite('Test Suite Name', (suite) => {

    // cases and setup goes here.

}, {description: "Optional description."});
```

- First param is the test suite name. 
- Second param is a method that receive the new suite instance as a single parameter. Use this method to define the test suite.
- Finally, you can add additional params, like textual description.

### Setup & Teardown

You can add `setup` and `teardown` methods to a test suite:

```js
testizy.suite('Test Suite Name', (suite) => {

    suite.setup(() => {
        // setup code goes here..
    });

    suite.teardown(() => {
        // teardown code goes here..
    });

}, {description: "Optional description."});
```

Note that both `setup` and `teardown` handlers can be async and return a `Promise`. If `setup` fails, all test cases in suite will be skipped.

## Define Test Cases

Finally, lets define test cases for our test suites, to actually test stuff:

```js
testizy.suite('Test Suite Name', (suite) => {

    suite.case('example test case to test something..', (assert) => {
        // test content goes here..
    });

}, {description: "Optional description."});
```

- First param is test case name.
- Second param is a method to run as the test itself. Accept a single argument, `Assert`, which is used to perform the checks (described later).
- Finally, you can add additional params, like `timeout` in ms to break the test if there's an unfulfilled promise.

The test case method can be async and return a promise.

### Async Calls

If you need an async calls inside your test cases, you can make the case method an async method and return a promise. When running the test, it will automatically wait for the case to finish:

```js
suite.case('some async test..', (assert) => {
    return new Promise(async (resolve, reject) => {
        let data = await someAsyncIoOp(); 
        assert.equals(data, "hello world!");
        resolve();
    });
}, {timeout: 1000});
```

Note the additional `timeout` option; If your returned promise is not resolved within 1000ms, the test will fail on timeout.

### Wait

You can define a pseudo-case that only creates a waiting time between test cases. For example if you have some cleanup code that happens every few seconds and you want to make sure its called between two cases, you can use this trick:

```js
suite.wait(1000, 'Wait for one second between tests.');
```

Note that this fake case will appear in the test results with the '[wait]' prefix.

## Assert

`Assert` is the object every test case get as an argument, and used to perform the test checks themselves. 

Note that all assert methods accept an optional error message parameter to show if the condition is not met. If no error message is provided, the assert will just generate one based on the test performed.

Another thing to keep in mind is that when an assert fails, it will throw a special exception that will break out of the test case. So if you wrap assert checks with `try-catch` (not recommended), be sure to rethrow the exception in case its of `Testizy.TestFailedException` type.

Assert provide the following methods:

### Assert.equals(actualValue, expectedValue, optionalMessage)

Perform a strict, deep comparison between actual value and expected value. It goes by the following logic:

1. If the values are not of the same type, or one of them is null / undefined while the other is not, will return false.
1. If the values are primitive types, will use the strict equation operator `===`.
2. If the values are custom objects, will check if one of them have `equals()` method implemented and if so, will use it. If not, will use strict equation operator `===`.
3. If the values are iterable objects like Array, Set, Map etc, or a dictionary, will go over their keys and strictly compare them, then will compare all the values recursively.
4. If the values are `Date`, will compare their epoch time (`getTime()`) value.

In other words, this comparison method can handle pretty much anything you throw at it, and will perform a comparison as strict as possible. This is probably what you'd use most of the time. 

Usage example:

```js
// the following will not fail the test, its equal:
assert.equals("hello world", "hello world");

// the following will not fail the test, its equal:
assert.equals({"hello": "world", "time": new Date(1000), "array": [1,2,3]}, {"hello": "world", "time": new Date(1000), "array": [1,2,3]});

// the following will fail the test due to the extra '4' in the second 'array' value:
assert.equals({"hello": "world", "time": new Date(1000), "array": [1,2,3]}, {"hello": "world", "time": new Date(1000), "array": [1,2,3,4]});
```

### Assert.notEquals(actualValue, expectedValue, optionalMessage)

Same as `assert.equals()`, but expect values to *not* be equal.

Usage example:

```js
// the following will fail the test, because its equal:
assert.notEquals("hello world", "hello world");

// the following will fail the test, because its equal:
assert.notEquals({"hello": "world", "time": new Date(1000), "array": [1,2,3]}, {"hello": "world", "time": new Date(1000), "array": [1,2,3]});

// the following will not fail the test, because of the extra '4' in the second 'array' value:
assert.notEquals({"hello": "world", "time": new Date(1000), "array": [1,2,3]}, {"hello": "world", "time": new Date(1000), "array": [1,2,3,4]});
```

### Assert.looseEquals(actualValue, expectedValue, optionalMessage)

Performs a simple loose equation check on values (using `==`). This method is not recursive and not strict.

Usage example:

```js
// this will not fail the test, as '1 + 1 == 2' is true
assert.looseEquals(1 + 1, 2);

// this will not fail the test, as 'true == 1' is true (1 will be converted to bool)
assert.looseEquals(true, 1);

// this will not fail the test, as '"1" == 1' is true (1 will be converted to string)
assert.looseEquals("1", 1);

// this will fail the test, as 'true == []' is false
assert.looseEquals(true, []);
```

### Assert.looseNotEquals(actualValue, expectedValue, optionalMessage)

Performs a simple loose equation check on values, expecting them to *not* be equal (using `!=`). This method is not recursive and not strict.

Usage example:

```js
// this will not fail the test, as '1 + 2 != 2' is true
assert.looseNotEquals(1 + 2, 2);

// this will not fail the test, as 'true != 0' is true
assert.looseNotEquals(true, 0);

// this will not fail the test, as '"2" != 1' is true
assert.looseNotEquals("2", 1);

// this will fail the test, as 'true != 1' is false (1 will be converted to bool)
assert.looseNotEquals(true, 1);
```

### Assert.true(actualValue, optionalMessage)

Checks if the given value converts to `true` value when `Boolean()` casting is used on it.

Usage example:

```js
// this will not fail the test, as Boolean(1) == true
assert.true(1);

// this will fail the test, as Boolean(0) == false
assert.true(0);
```

### Assert.false(actualValue, optionalMessage)

Checks if the given value converts to `false` value when `Boolean()` casting is used on it.

Usage example:

```js
// this will not fail the test, as Boolean(0) == false
assert.false(0);

// this will fail the test, as Boolean(1) == true
assert.false(1);
```

### Assert.instanceOf(actualValue, type, optionalMessage)

Checks if the given value is of a given type. For primitive types (undefined, string, numbers, boolean..) it will use `typeof`, since `"someString" instanceof String` is false.

For any other type, it will use the `instanceof` operator. Note that nearly all types are also an `Object` (for example a Function is both `Object` and `Function`), so usually comparing to `Object` type is meaningless.

In addition, this method treat `null` and `undefined` differently than default JavaScript behavior:

1. `null` will not be considered an `Object`. Instead, `null` value will always return false.
2. `undefined` will only return true if the `type` provided is also `undefined`.

Usage example:

```js
// these will not fail the test
assert.instanceOf(0, Number);
assert.instanceOf("a", String);
assert.instanceOf({}, Object);
assert.instanceOf(new MyClass(), MyClass);

// this will also not fail the test (a is undefined)
let a;
assert.instanceOf(a, undefined);

// these will fail the test
assert.instanceOf("0", Number);
assert.instanceOf({}, Date);
assert.instanceOf(undefined, Object);

// despite the fact that in js null is an object, this will fail the test as we treat null as non type
assert.instanceOf(null, Object);
```

### Assert.empty(actualValue, optionalMessage)

Checks if the given value is valid (ie not `null` or `undefined`), is iterable or array-like, but is empty.

Works on objects like buffer, array, set, map, and anything else that has `length` or `size` property.

Usage example:

```js
// these will not fail the test
assert.empty([]);
assert.empty(new Set());
assert.empty({});

// these will fail the test
assert.empty({"hello": "world"});
assert.empty([1]);
```

### Assert.notEmpty(actualValue, optionalMessage)

Just like `assert.empty()`, but expect value to *not* be empty.

Usage example:

```js
// these will not fail the test
assert.notEmpty({"hello": "world"});
assert.notEmpty([1]);

// these will fail the test
assert.notEmpty([]);
assert.notEmpty(new Set());
assert.notEmpty({});
```

### Assert.fail(optionalMessage)

Fail the test immediately with a reason. You can use this if you know the test should fail for some reason that is not based on any suitable comparison.

Usage example:

```js
assert.fail("Test failed because skies are blue today!");
```

### Assert.is(actualValue, expectedValue, optionalMessage)

Performs an `Object.is()` check between actual and expected values.

Usage example:

```js
// these will not fail the test
assert.is(0, 0);
assert.is(NaN, 0/0);

// these will fail the test
assert.is(0, 1);
assert.is("foo", "bar");
```

### Assert.isNot(actualValue, expectedValue, optionalMessage)

Performs an `Object.is()` check between actual and expected values, but expect values to *not* be the same.

Usage example:

```js
// these will not fail the test
assert.isNot(0, 1);
assert.isNot("foo", "bar");

// these will fail the test
assert.isNot(0, 0);
assert.isNot(NaN, 0/0);
```

### Assert.except(method, optionalErrorType, optionalMessage)

Execute a method and expect it to throw an exception. 

```js
// these will not fail the test
assert.except(() => {throw new Error("test");});
assert.except(() => {throw new MyCustomError("test");}, MyCustomError);

// these will fail the test (no exception or wrong type is thrown)
assert.except(() => {});
assert.except(() => {throw new Error("test");}, MyCustomError);
```


### Assert.wait(time, comment)

Not really a check, but a helper method to wait before proceeding with test. Generate a `Promise` and resolve it after given time.

Usage example:

```js
// wait for 1000 ms (test case is async)
await assert.sleep(1000, 'Wait for one second.');
```


## Run The Tests

Finally after writing our tests its time to run them. You can execute all tests and wait for them to end like this:

```js
// will run all tests
let results = await testizy.run();
```

Or you can provide a set of specific test suites to execute:

```js
// will only run "test suite" and "another test suite" tests
let results = await testizy.run(["test suite", "another test suite"]);
```

The `results` object will be a `Map` instance, where keys are test suite names, and values are instances of `Testizy.TestResult`.

`TestResult` instance have the following properties:

- **testName**: Test suite name.
- **testDescription** Test suite description.
- **isError(caseName)**: Check if a specific test case failed.
- **isSuccess(caseName)**: Check if a specific test case was a success.
- **results**: Return a list of test result pairs: `[caseName, caseResult]`, where caseResults is a dictionary with `{success, reason, time, stackTrace}`.
- **errorsCount**: Get failed tests count.
- **successCount**: Get success tests count.
- **totalCount**: Get total tests count.


## Render Results

*Testizy* comes with a built-in method to render results as Html for browsers, or write them as console output for *NodeJS*.

### Render To Html (Browser)

You can render all test results to Html with `renderAllTests()`:

```js
let results = await testizy.run();
renderAllTests(results);
```

Or you can also provide a parent DOM element as second param:

```js
renderAllTests(results, document.getElementById('my-test-results-div'));
```

#### Render As You Go

If you don't want to wait for all the tests to finish before rendering, you can render them as they finish one by one:

```js
testizy.run(null, testizy.renderTest);
```

The second param in `run()` accept a callback method to invoke on any test suite that finishes. `testizy.renderTest` is a method to render a single test result, that have a signature matching the one expected by `run()`.


### Write To Log (Node)

You can write all test results to log with `logAllTests()`:

```js
let results = await testizy.run();
testizy.logAllTests(results);
```

This will write results to `console` with color codes enabled. You can control if to enable colors or not, or provide alternative console to write to:

```js
testizy.logAllTests(results, enableColors, myConsoleObject);
```

#### Log As You Go

If you don't want to wait for all the tests to finish before writing to log, you can write test results them as they finish one by one:

```js
testizy.run(null, testizy.logTest);
```

The second param in `run()` accept a callback method to invoke on any test suite that finishes. `testizy.logTest` is a method to render a single test result, that have a signature matching the one expected by `run()`.

# Changes

## 1.0.1

- Added `Assert.isNot()`.
- Added `Assert.wait()`.
- Added `TestSuite.Wait()`.

# License

*Testizy* is distributed under the MIT license and can be used for any purpose. Have fun!
