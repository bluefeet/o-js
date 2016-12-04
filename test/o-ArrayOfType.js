var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var numberType = new o.Type({
        validate: function (val) { return (typeof val === 'number') ? true : false },
        coerce: function(val) { return val + 100 }
    });
    var numbersType = new o.ArrayOfType( numberType );

    t.is( numbersType.check(1), false, 'fails on non-array' );
    t.is( numbersType.check([]), true, 'passes on empty array' );
    t.is( numbersType.check(['a',1]), false, 'fails with non-number value' );
    t.is( numbersType.check([1, 2]), true, 'passes with all numbers' );

    t.deepEqual(
        numbersType.coerce([1,2]),
        [101, 102],
        'coercion carried through to inner type'
    );

    t.end();
});
