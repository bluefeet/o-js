var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.dateType.check(1), false, 'number is not a Date' );
    t.is( o.dateType.check(new Date()), true, 'Date is a Date' );
    t.end();
});
