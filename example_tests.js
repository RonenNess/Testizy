// for node tests
if (typeof Testizy === 'undefined') {
    Testizy = require('./lib');
}

// object to use for tests
class ClassWithEquals
{
    constructor(val)
    {
        this.value = val;
    }

    equals(other)
    {
        return other && other.constructor === this.constructor && this.value === other.value;
    }
}


/**
 * Define an exception for failing test.
 * @param {String} message Test failure exception.
 */
function TestException(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error) {
        Error.captureStackTrace(this, TestException);
    }
    else {
        this.stack = (new Error()).stack;
    }
    if (typeof this.stack === 'string') {
        this.stack = this.stack.split('\n');
    }
}
TestException.prototype = Object.create(Error.prototype);
TestException.prototype.name = "TestException";
TestException.prototype.constructor = TestException;


// create the tests suite.
let testizy = new Testizy();

// define a test suite for equals that supposed to work.
testizy.suite('Equals - ok tests', (suite) => {

    suite.case('1 + 1 == 2', (assert) => {
        assert.equals(1 + 1, 2);
    });

    suite.case('1 + 1 == 2 && 2 + 2 == 4; (multiple asserts)', (assert) => {
        assert.equals(1 + 1, 2);
        assert.equals(2 + 2, 4);
    });

    suite.case('true == true', (assert) => {
        assert.equals(true, true);
    });

    suite.case('false == false', (assert) => {
        assert.equals(false, false);
    });

    suite.case('null == null', (assert) => {
        assert.equals(null, null);
    });

    suite.case('undefined == undefined', (assert) => {
        assert.equals(undefined, undefined);
    });

    suite.case('"hello" == "hello"', (assert) => {
        assert.equals("hello", "hello");
    });

    suite.case('[] == []', (assert) => {
        assert.equals([], []);
    });

    suite.case('[1,2,3] == [1,2,3]', (assert) => {
        assert.equals([1,2,3], [1,2,3]);
    });

    suite.case('{} == {}', (assert) => {
        assert.equals({}, {});
    });

    suite.case('{1:2} == {1:2}', (assert) => {
        assert.equals({1:2}, {1:2});
    });

    suite.case('new Date(1000) == new Date(1000)', (assert) => {
        assert.equals(new Date(1000), new Date(1000));
    });

    suite.case('{...}, {...}', (assert) => {
        let now = new Date();
        assert.equals({"hello": "world", "time": now, "array": [1,2,3]}, {"hello": "world", "time": now, "array": [1,2,3]});
    });

    suite.case('new Set([1,2,3]) == new Set([1,2,3])', (assert) => {
        assert.equals(new Set([1,2,3]), new Set([1,2,3]));
    });

    suite.case('{"a": new Set([1,2,3]), "b": [1,2, {"c": 3}], "c": {1:2}} == {"a": new Set([1,2,3]), "b": [1,2, {"c": 3}], "c": {1:2}}', (assert) => {
        assert.equals({"a": new Set([1,2,3]), "b": [1,2, {"c": 3}], "c": {1:2}}, {"a": new Set([1,2,3]), "b": [1,2, {"c": 3}], "c": {1:2}});
    });

    suite.case('let a = {..}; a == a', (assert) => {
        let a = {5: 1};
        assert.equals(a, a);
    });

    suite.case('let a = 5; let b = 5; a == b', (assert) => {
        let a = 5;
        let b = 5;
        assert.equals(a, b);
    });

    suite.case('new ClassWithEquals("hello") == new ClassWithEquals("hello")', (assert) => {
        assert.equals(new ClassWithEquals("hello"), new ClassWithEquals("hello"));
    });

}, {description: "This test suite checks assert.equals(), all tests should pass."});

// define a test suite for equals that supposed to fail.
testizy.suite('Equals - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) 1 + 2 == 2', (assert) => {
        assert.equals(1 + 2, 2);
    });

    suite.case('(should fail) 1 + 1 == 3 && 2 + 2 == 4; (multiple asserts)', (assert) => {
        assert.equals(1 + 1, 3);
        assert.equals(2 + 2, 4);
    });

    suite.case('(should fail) 1 + 1 == 2 && 2 + 2 == 5; (multiple asserts)', (assert) => {
        assert.equals(1 + 1, 2);
        assert.equals(2 + 2, 5);
    });

    suite.case('(should fail) true == false', (assert) => {
        assert.equals(true, false);
    });

    suite.case('(should fail) false == 0', (assert) => {
        assert.equals(false, 0);
    });

    suite.case('(should fail) null == undefined', (assert) => {
        assert.equals(null, undefined);
    });

    suite.case('(should fail) undefined == 0', (assert) => {
        assert.equals(undefined, 0);
    });

    suite.case('(should fail) [1] == [2]', (assert) => {
        assert.equals([1], [2]);
    });

    suite.case('(should fail) [1,3,2] == [1,2,3]', (assert) => {
        assert.equals([1,3,2], [1,2,3]);
    });

    suite.case('(should fail) {1:2} == {}', (assert) => {
        assert.equals({1:2}, {});
    });

    suite.case('(should fail) {2:1} == {1:2}', (assert) => {
        assert.equals({2:1}, {1:2});
    });

    suite.case('(should fail) {1: false} == {1: 0}', (assert) => {
        assert.equals({1: false}, {1: 0});
    });

    suite.case('(should fail) new Set([1,2]) == new Set([1,2,3])', (assert) => {
        assert.equals(new Set([1,2]), new Set([1,2,3]));
    });

    suite.case('(should fail) {"a": new Set([1,2,3]), "b": [1,2, {"c": 4}], "c": {1:2}} == {"a": new Set([1,2,3]), "b": [1,2, {"c": 3}], "c": {1:2}}', (assert) => {
        assert.equals({"a": new Set([1,2,3]), "b": [1,2, {"c": 4}], "c": {1:2}}, {"a": new Set([1,2,3]), "b": [1,2, {"c": 3}], "c": {1:2}});
    });

    suite.case('(should fail) "hello" == "world"', (assert) => {
        assert.equals("hello", "world");
    });

    suite.case('(should fail) {array:[1,2,3], ..}, {array:[1,2,3,4], ..}', (assert) => {
        let now = new Date();
        assert.equals({"hello": "world", "time": now, "array": [1,2,3]}, {"hello": "world", "time": now, "array": [1,2,3,4]});
    });

    suite.case('(should fail) let a = {..}; let b = {..}; a == b', (assert) => {
        let a = {5: 1};
        let b = {5: 1};
        assert.equals(a, n);
    });

    suite.case('(should fail) let a = 5; let b = 6; a == b', (assert) => {
        let a = 5;
        let b = 6;
        assert.equals(a, b);
    });

    suite.case('(should fail) new ClassWithEquals("hello") == new ClassWithEquals("world")', (assert) => {
        assert.equals(new ClassWithEquals("hello"), new ClassWithEquals("world"));
    });

}, {description: "This test suite checks assert.equals(), all tests should fail."});


// define a test suite for not equals that supposed to pass.
testizy.suite('Not Equals - ok tests', (suite) => {

    suite.case('1 + 2 != 2', (assert) => {
        assert.notEquals(1 + 2, 2);
    });

    suite.case('true != false', (assert) => {
        assert.notEquals(true, false);
    });

    suite.case('false != 0', (assert) => {
        assert.notEquals(false, 0);
    });

    suite.case('null != undefined', (assert) => {
        assert.notEquals(null, undefined);
    });

    suite.case('new Date(1001) == new Date(1000)', (assert) => {
        assert.notEquals(new Date(1001), new Date(1000));
    });

    suite.case('undefined != 0', (assert) => {
        assert.notEquals(undefined, 0);
    });

    suite.case('"hello" != "world"', (assert) => {
        assert.notEquals("hello", "world");
    });

    suite.case('let a = {xxx}; let b = {yyy}; a != b', (assert) => {
        let a = {5: 1};
        let b = {5: 2};
        assert.notEquals(a, b);
    });

    suite.case('{1: false} != {1: 0}', (assert) => {
        assert.notEquals({1: false}, {1: 0});
    });

    suite.case('let a = 5; let b = 6; a != b', (assert) => {
        let a = 5;
        let b = 6;
        assert.notEquals(a, b);
    });

    suite.case('new ClassWithEquals("hello") != new ClassWithEquals("world")', (assert) => {
        assert.notEquals(new ClassWithEquals("hello"), new ClassWithEquals("world"));
    });

}, {description: "This test suite checks assert.notEquals(), all tests should pass."});


// define a test suite for equals that supposed to fail.
testizy.suite('Not Equals - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) 1 + 1 != 2', (assert) => {
        assert.notEquals(1 + 1, 2);
    });

    suite.case('(should fail) true != true', (assert) => {
        assert.notEquals(true, true);
    });

    suite.case('(should fail) false != false', (assert) => {
        assert.notEquals(false, false);
    });

    suite.case('(should fail) null != null', (assert) => {
        assert.notEquals(null, null);
    });

    suite.case('(should fail) undefined != undefined', (assert) => {
        assert.notEquals(undefined, undefined);
    });

    suite.case('(should fail) "hello" != "hello"', (assert) => {
        assert.notEquals("hello", "hello");
    });

    suite.case('(should fail) let a = {..}; a != a', (assert) => {
        let a = {5: 1};
        assert.notEquals(a, a);
    });

    suite.case('(should fail) let a = 5; let b = 5; a != b', (assert) => {
        let a = 5;
        let b = 5;
        assert.notEquals(a, b);
    });

    suite.case('(should fail) new ClassWithEquals("hello") != new ClassWithEquals("hello")', (assert) => {
        assert.notEquals(new ClassWithEquals("hello"), new ClassWithEquals("hello"));
    });

}, {description: "This test suite checks assert.notEquals(), all tests should fail."});


// define a test suite for true that supposed to work.
testizy.suite('True - ok tests', (suite) => {

    suite.case('true(1)', (assert) => {
        assert.true(1);
    });

    suite.case('true([])', (assert) => {
        assert.true([]);
    });

    suite.case('true({})', (assert) => {
        assert.true({});
    });

    suite.case('true(true)', (assert) => {
        assert.true(true);
    });

    suite.case('true(new Date())', (assert) => {
        assert.true(new Date());
    });

}, {description: "This test suite checks assert.true(), all tests should pass."});


// define a test suite for true that supposed to work.
testizy.suite('True - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) true(0)', (assert) => {
        assert.true(0);
    });

    suite.case('(should fail) true(null)', (assert) => {
        assert.true(null);
    });

    suite.case('(should fail) true(undefined)', (assert) => {
        assert.true(undefined);
    });

    suite.case('(should fail) true(false)', (assert) => {
        assert.true(false);
    });

}, {description: "This test suite checks assert.true(), all tests should fail."});


// define a test suite for false that supposed to work.
testizy.suite('False - ok tests', (suite) => {

    suite.case('false(0)', (assert) => {
        assert.false(0);
    });

    suite.case('false(null)', (assert) => {
        assert.false(null);
    });

    suite.case('false(undefined)', (assert) => {
        assert.false(undefined);
    });

    suite.case('false(false)', (assert) => {
        assert.false(false);
    });

}, {description: "This test suite checks assert.false(), all tests should pass."});


// define a test suite for false that supposed to fail.
testizy.suite('False - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) false(1)', (assert) => {
        assert.false(1);
    });

    suite.case('(should fail) false([])', (assert) => {
        assert.false([]);
    });

    suite.case('(should fail) false({})', (assert) => {
        assert.false({});
    });

    suite.case('(should fail) false(true)', (assert) => {
        assert.false(true);
    });

    suite.case('(should fail) false(new Date())', (assert) => {
        assert.false(new Date());
    });

}, {description: "This test suite checks assert.false(), all tests should fail."});


// define a test suite for instanceOf that supposed to work.
testizy.suite('InstanceOf - ok tests', (suite) => {

    suite.case('instanceOf(0, Number)', (assert) => {
        assert.instanceOf(0, Number);
    });

    suite.case('instanceOf(true, Boolean)', (assert) => {
        assert.instanceOf(true, Boolean);
    });

    suite.case('instanceOf("a", String)', (assert) => {
        assert.instanceOf("a", String);
    });

    suite.case('instanceOf(new Date(), Date)', (assert) => {
        assert.instanceOf(new Date(), Date);
    });

    suite.case('instanceOf({}, Object)', (assert) => {
        assert.instanceOf({}, Object);
    });

    suite.case('instanceOf([], Array)', (assert) => {
        assert.instanceOf([], Array);
    });

    suite.case('instanceOf([], Object)', (assert) => {
        assert.instanceOf([], Object);
    });

    suite.case('instanceOf(new Set(), Set)', (assert) => {
        assert.instanceOf(new Set(), Set);
    });

    suite.case('instanceOf(new Map(), Map)', (assert) => {
        assert.instanceOf(new Map(), Map);
    });

    suite.case('instanceOf(() => {}, Function)', (assert) => {
        assert.instanceOf(() => {}, Function);
    });

    suite.case('instanceOf(() => {}, Object)', (assert) => {
        assert.instanceOf(() => {}, Object);
    });

    suite.case('instanceOf(new ClassWithEquals(1), Object)', (assert) => {
        assert.instanceOf(new ClassWithEquals(1), Object);
    });

    suite.case('instanceOf(new ClassWithEquals(1), ClassWithEquals)', (assert) => {
        assert.instanceOf(new ClassWithEquals(1), ClassWithEquals);
    });

    suite.case('instanceOf(undefined, undefined)', (assert) => {
        assert.instanceOf(undefined, undefined);
    });

}, {description: "This test suite checks assert.instanceOf(), all tests should pass."});


// define a test suite for instanceOf that supposed to fail.
testizy.suite('InstanceOf - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) instanceOf("0", Number)', (assert) => {
        assert.instanceOf("0", Number);
    });

    suite.case('(should fail) instanceOf(1, Boolean)', (assert) => {
        assert.instanceOf(1, Boolean);
    });

    suite.case('(should fail) instanceOf(null, Object)', (assert) => {
        assert.instanceOf(null, Object);
    });

    suite.case('(should fail) instanceOf("1", Number)', (assert) => {
        assert.instanceOf("1", Number);
    });

    suite.case('(should fail) instanceOf({}, Date)', (assert) => {
        assert.instanceOf({}, Date);
    });

    suite.case('(should fail) instanceOf({}, Array)', (assert) => {
        assert.instanceOf({}, Array);
    });

    suite.case('(should fail) instanceOf(new Set(), Array)', (assert) => {
        assert.instanceOf(new Set(), Array);
    });

    suite.case('(should fail) instanceOf(new Map(), Set)', (assert) => {
        assert.instanceOf(new Map(), Set);
    });

    suite.case('(should fail) instanceOf(undefined, Object)', (assert) => {
        assert.instanceOf(undefined, Object);
    });

    suite.case('(should fail) instanceOf(new ClassWithEquals(1), Array)', (assert) => {
        assert.instanceOf(new ClassWithEquals(1), Array);
    });

}, {description: "This test suite checks assert.instanceOf(), all tests should fail."});  


// define a test suite for is that supposed to work.
testizy.suite('Is - ok tests', (suite) => {

    suite.case('is(0, 0)', (assert) => {
        assert.is(0, 0);
    });

    suite.case('is("foo", "foo")', (assert) => {
        assert.is("foo", "foo");
    });

    suite.case('is(a, a)', (assert) => {
        let a = {1:2};
        assert.is(a, a);
    });

    suite.case('is(NaN, 0/0)', (assert) => {
        assert.is(NaN, 0/0);
    });

}, {description: "This test suite checks assert.is(), all tests should pass."});


// define a test suite for is that supposed to fail.
testizy.suite('Is - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) is(0, 1)', (assert) => {
        assert.is(0, 1);
    });

    suite.case('(should fail) is("foo", "bar")', (assert) => {
        assert.is("foo", "bar");
    });

    suite.case('(should fail) is(a, b)', (assert) => {
        let a = {1:2};
        let b = {1:2};
        assert.is(a, b);
    });

    suite.case('(should fail) is(NaN, 1)', (assert) => {
        assert.is(NaN, 1);
    });

}, {description: "This test suite checks assert.is(), all tests should fail."});


// define a test suite for empty that supposed to work.
testizy.suite('Empty - ok tests', (suite) => {

    suite.case('empty([])', (assert) => {
        assert.empty([]);
    });

    suite.case('empty({})', (assert) => {
        assert.empty({});
    });

    suite.case('empty(new Set())', (assert) => {
        assert.empty(new Set());
    });

    suite.case('empty(new Uint16Array())', (assert) => {
        assert.empty(new Uint16Array());
    });

    suite.case('empty(new Map())', (assert) => {
        assert.empty(new Map());
    });

}, {description: "This test suite checks assert.empty(), all tests should pass."});


// define a test suite for empty that supposed to fail.
testizy.suite('Empty - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) empty([1])', (assert) => {
        assert.empty([1]);
    });

    suite.case('(should fail) empty({1:1})', (assert) => {
        assert.empty({1:1});
    });

    suite.case('(should fail) empty(new Set([1]))', (assert) => {
        assert.empty(new Set([1]));
    });

    suite.case('(should fail) empty(new Uint16Array(1))', (assert) => {
        assert.empty(new Uint16Array(1));
    });

    suite.case('(should fail) empty(new Map(..))', (assert) => {
        let val = new Map();
        val.set(1, 2);
        assert.empty(val);
    });

}, {description: "This test suite checks assert.empty(), all tests should fail."});


// define a test suite for not empty that supposed to fail.
testizy.suite('Not Empty - ok tests', (suite) => {

    suite.case('notEmpty([1])', (assert) => {
        assert.notEmpty([1]);
    });

    suite.case('notEmpty({1:1})', (assert) => {
        assert.notEmpty({1:1});
    });

    suite.case('notEmpty(new Set([1]))', (assert) => {
        assert.notEmpty(new Set([1]));
    });

    suite.case('notEmpty(new Uint16Array(1))', (assert) => {
        assert.notEmpty(new Uint16Array(1));
    });

    suite.case('notEmpty(new Map(..))', (assert) => {
        let val = new Map();
        val.set(1, 2);
        assert.notEmpty(val);
    });

}, {description: "This test suite checks assert.notEmpty(), all tests should pass."});


// define a test suite for empty that supposed to work.
testizy.suite('Not Empty - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) notEmpty([])', (assert) => {
        assert.notEmpty([]);
    });

    suite.case('(should fail) notEmpty({})', (assert) => {
        assert.notEmpty({});
    });

    suite.case('(should fail) notEmpty(new Set())', (assert) => {
        assert.notEmpty(new Set());
    });

    suite.case('(should fail) notEmpty(new Uint16Array())', (assert) => {
        assert.notEmpty(new Uint16Array());
    });

    suite.case('(should fail) notEmpty(new Map())', (assert) => {
        assert.notEmpty(new Map());
    });

}, {description: "This test suite checks assert.notEmpty(), all tests should fail."});


// define a test suite for except that supposed to work.
testizy.suite('Except - ok tests', (suite) => {

    suite.case('except(() => {throw new Error("test");})', (assert) => {
        assert.except(() => {throw new Error("test");});
    });

    suite.case('except(() => {throw new TestException("test");}, TestException)', (assert) => {
        assert.except(() => {throw new TestException("test");}, TestException);
    });

}, {description: "This test suite checks assert.except(), all tests should pass."});


// define a test suite for except that supposed to fail.
testizy.suite('Except - fail tests (should be errors!)', (suite) => {
            
    suite.case('(should fail) except(() => {})', (assert) => {
        assert.except(() => {});
    });
            
    suite.case('(should fail) except(true)', (assert) => {
        assert.except(true);
    });

    suite.case('(should fail) except(() => {throw new TestException("test");}, Error)', (assert) => {
        assert.except(() => {throw new TestException("test");}, Error);
    });

    suite.case('(should fail) except(() => {throw new Error("test");}, TestException)', (assert) => {
        assert.except(() => {throw new Error("test");}, TestException);
    });

}, {description: "This test suite checks assert.except(), all tests should fail."});


// define a test suite for loose equals that supposed to work.
testizy.suite('Loose Equals - ok tests', (suite) => {

    suite.case('1 + 1 == 2', (assert) => {
        assert.looseEquals(1 + 1, 2);
    });

    suite.case('true == 1', (assert) => {
        assert.looseEquals(true, 1);
    });

    suite.case('false == 0', (assert) => {
        assert.looseEquals(false, 0);
    });

    suite.case('"1" == 1', (assert) => {
        assert.looseEquals("1", 1);
    });

}, {description: "This test suite checks assert.looseEquals(), all tests should pass."});


// define a test suite for loose equals that supposed to fail.
testizy.suite('Loose Equals - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) 1 + 1 == 3', (assert) => {
        assert.looseEquals(1 + 1, 3);
    });

    suite.case('(should fail) true == []', (assert) => {
        assert.looseEquals(true, []);
    });

    suite.case('(should fail) false == 1', (assert) => {
        assert.looseEquals(false, 1);
    });

    suite.case('(should fail) "2" == 1', (assert) => {
        assert.looseEquals("2", 1);
    });

}, {description: "This test suite checks assert.looseEquals(), all tests should fail."});


// define a test suite for loose equals that supposed to work.
testizy.suite('Loose Not Equals - ok tests', (suite) => {

    suite.case('1 + 1 != 3', (assert) => {
        assert.looseNotEquals(1 + 1, 3);
    });

    suite.case('true != 0', (assert) => {
        assert.looseNotEquals(true, 0);
    });

    suite.case('false != 1', (assert) => {
        assert.looseNotEquals(false, 1);
    });

    suite.case('"1" != 2', (assert) => {
        assert.looseNotEquals("1", 2);
    });

}, {description: "This test suite checks assert.looseNotEquals(), all tests should pass."});


// define a test suite for loose not equals that supposed to fail.
testizy.suite('Loose Not Equals - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) 1 + 1 != 2', (assert) => {
        assert.looseNotEquals(1 + 1, 2);
    });

    suite.case('(should fail) true != 1', (assert) => {
        assert.looseNotEquals(true, 1);
    });

    suite.case('(should fail) false != 0', (assert) => {
        assert.looseNotEquals(false, 0);
    });

    suite.case('(should fail) "1" != 1', (assert) => {
        assert.looseNotEquals("1", 1);
    });

}, {description: "This test suite checks assert.looseNotEquals(), all tests should fail."});


// define a test suite for 'fail'' that supposed to fail.
testizy.suite('Fail - fail tests (should be errors!)', (suite) => {

    suite.case('(should fail) fail()', (assert) => {
        assert.fail();
    });

    suite.case('(should fail) fail("custom reason")', (assert) => {
        assert.fail("This is a custom failure text.");
    });

}, {description: "This test suite checks assert.fail(), all tests should fail."});

// define a test suite for async cases that return promises.
testizy.suite('Async Tests - resolved', (suite) => {

    suite.case('promise resolved', (assert) => {
        return new Promise((resolve, reject) => {
            assert.equals(1 + 1, 2);
            resolve();
        });
    });

    suite.case('promise resolved with delay', (assert) => {
        return new Promise((resolve, reject) => {
            assert.equals(1 + 1, 2);
            setTimeout(resolve, 100);
        });
    });

}, {description: "This test suite checks test cases that return a resolved promise."});


// define a test suite for async cases that return promises and reject.
testizy.suite('Async Tests - rejected & timeout (should be errors!)', (suite) => {

    suite.case('promise rejected', (assert) => {
        return new Promise((resolve, reject) => {
            assert.equals(1 + 1, 2);
            reject("This method was rejected!");
        });
    });

    suite.case('promise throws exception', (assert) => {
        return new Promise((resolve, reject) => {
            assert.equals(1 + 1, 2);
            throw new Error("This is an internal exception!");
        });
    }, {timeout: 1000});

    suite.case('promise fails test', (assert) => {
        return new Promise((resolve, reject) => {
            assert.equals(1 + 1, 3);
            resolve();
        });
    });

    suite.case('promise timeouts (1000ms)', (assert) => {
        return new Promise((resolve, reject) => {
            assert.equals(1 + 1, 2);
        });
    }, {timeout: 1000});

}, {description: "This test suite checks test cases that return a rejected or timedout promise."});


// for setup / teardown tests
var _setupCheck;


// test setup and teardown code
testizy.suite('Setup and teardown methods', (suite) => {

    suite.setup(() => {
        _setupCheck = true;
    });

    suite.case('window._setupCheck == true (set by the setup code)', (assert) => {
        assert.true(_setupCheck);
    });

    suite.teardown(() => {
        _setupCheck = false;
    });

}, {description: "This test suite make sure the setup and teardown methods works."});

// check that previous teardown worked
testizy.suite('Setup and teardown methods - make sure teardown worked', (suite) => {

    suite.case('_setupCheck == false (set by the teardown code)', (assert) => {
        assert.false(_setupCheck);
    });

}, {description: "This test suite make sure the previous suite teardown code ran."});  




// test setup and teardown code
testizy.suite('Async setup and teardown methods', (suite) => {

    suite.setup(() => {
        return new Promise((resolve, reject) => {
            _setupCheck = true;
            resolve();
        });
    });

    suite.case('_setupCheck == true (set by the setup code)', (assert) => {
        assert.true(_setupCheck);
    });

    suite.teardown(() => {
        return new Promise((resolve, reject) => {
            _setupCheck = false;
            resolve();
        });
    });

}, {description: "This test suite make sure the setup and teardown methods works with promises."});

// check that previous teardown worked
testizy.suite('Async setup and teardown methods - make sure teardown worked', (suite) => {

    suite.case('_setupCheck == false (set by the teardown code)', (assert) => {
        assert.false(_setupCheck);
    });

}, {description: "This test suite make sure the previous suite teardown code ran."});  

// run all tests and render them in browser
if (typeof document !== 'undefined') {
    testizy.injectDefaultCss();
    testizy.run(null, testizy.renderTest);
}
// run all tests in nodejs
else {
    let runTests = async () => {
        let results = await testizy.run();
        console.log ("------------------------------------------------------");
        console.log ("FINISHED RUNNING TESTS! HERE ARE THE RESULTS..");
        console.log ("Note: to disable all output above set logger to null");
        console.log ("------------------------------------------------------");
        testizy.logAllTests(results, true, console);
    }
    runTests();
}
