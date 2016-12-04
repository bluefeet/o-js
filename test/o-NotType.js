var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var numberType = new o.Type(function (val) { return (typeof val === 'number') ? true : false });
    var notNumberType = new o.NotType( numberType );

    t.is( numberType.check(1), true, 'number is a number' );
    t.is( notNumberType.check(1), false, 'number is not not a number' );

    t.is( numberType.check('abc'), false, 'string is not a number' );
    t.is( notNumberType.check('abc'), true, 'string is not not not a number (confused?)' );

    t.end();
});
