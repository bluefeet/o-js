var o = require('o-core');
require('../o-types');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.regExpType.check(1), false, 'number is not a RegExp' );
    t.is( o.regExpType.check(new RegExp()), true, 'RegExp is a RegExp' );
    t.end();
});
