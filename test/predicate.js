var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var obj = {};
    obj.hasX = o.predicate('x');

    t.notOk( obj.hasX(), 'does not have value' );

    obj.x = undefined;
    t.notOk( obj.hasX(), 'undefined does not count' );

    obj.x = null;
    t.ok( obj.hasX(), 'has null value' );

    obj.x = 2;
    t.ok( obj.hasX(), 'has value' );

    t.end();
});
