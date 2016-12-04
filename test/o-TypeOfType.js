var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var numberType = new o.TypeOfType('number');

    t.is( numberType.check(1), true, 'number is a number' );
    t.is( numberType.check('abc'), false, 'string is not a number' );

    t.end();
});
