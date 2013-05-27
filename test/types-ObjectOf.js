var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var numberType = new o.Type(function (val) { return (typeof val === 'number') ? true : false });
    var numbersType = new o.ObjectOfType( numberType );

    t.is( numbersType.check(1), false, 'fails on non-object' );
    t.is( numbersType.check({}), true, 'passes on empty object' );
    t.is( numbersType.check({a:'b'}), false, 'fails with non-number value' );
    t.is( numbersType.check({a:2}), true, 'passes with all numbers' );

    t.end();
});
