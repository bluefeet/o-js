var o = require('./o.js');

var passed = 0;
var failed = 0;

function pass (name) {
    console.log( 'ok - ' + name );
    passed++;
}

function fail (name) {
    console.log('not ok - ' + name);
    failed++;
}

function ok (bool, msg) {
    if (bool) { pass(msg) }
    else { fail(msg) }
}

function is (value, expected, msg) {
    if (value === expected) { pass(msg) }
    else { fail(msg) }
}

var predicateCount = 0;
var testPredicate = o.after( o.predicate('test'), function () { predicateCount++ } );

var writerCount = 0;
var testWriter = o.after( o.writer('test'), function () { writerCount++ } );

is( o.reader('test').call({test:'one'}), 'one', 'reader: returned value' );
is( o.reader('test').call({}), undefined, 'reader: returned undefined' );
is( o.reader('test').call({test:null}), null, 'reader: returned null' );

o.reader('test', {predicate: testPredicate}).call({});
is( predicateCount, 1, 'reader: custom predicate was called' );

is( o.reader('test', {default:'two'}).call({}), 'two', 'reader: returned default value' );
is( o.reader('test', {default:function () { return 'three' }}).call({}), 'three', 'reader: returned value from default function' );
is( o.reader('test', {default:function () { return function () { return 'four' } }}).call({})(), 'four', 'reader: returned function from default function' );
is( o.reader('test', {default:'five'}).call({test:null}), null, 'reader: returned non-default value' );

o.reader('test', {writer: testWriter, default:'foo'}).call({});
is( writerCount, 1, 'reader: custom writer was called' );

var requiredFailed = false;
try { o.reader('test', {required:true}).call({}) }
catch (e) { requiredFailed = true }
ok( requiredFailed, 'reader: required caused exception' );

var requiredPassed = true;
try { o.reader('test', {required:true}).call({test:3284}) }
catch (e) { requiredPassed = false }
ok( requiredPassed, 'reader: required ignored when set' );

