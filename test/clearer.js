var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var clearX = o.clearer('x');
    var obj = {};
    t.equal( obj.x, undefined, 'value is undefined' );

    clearX.call(obj);
    t.equal( obj.x, undefined, 'value is undefined after clear' );

    obj.x = 32;
    t.equal( obj.x, 32, 'value is set' );

    clearX.call(obj);
    t.equal( obj.x, undefined, 'value is undefined after clear' );

    t.end();
});
