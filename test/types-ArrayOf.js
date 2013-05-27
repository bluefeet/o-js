var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var numberType = new o.Type(function (val) { return (typeof val === 'number') ? true : false });
    var numbersType = new o.ArrayOfType( numberType );

    t.is( numbersType.check(1), false, 'fails on non-array' );
    t.is( numbersType.check([]), true, 'passes on empty array' );
    t.is( numbersType.check(['a',1]), false, 'fails with non-number value' );
    t.is( numbersType.check([1, 2]), true, 'passes with all numbers' );

    t.end();
});
