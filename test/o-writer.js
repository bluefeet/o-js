var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var obj = { setX: o.writer('x') };
    t.equal( obj.x, undefined, 'property started as undefined' );
    t.equal( obj.setX(2), undefined, 'original value is returned' );
    t.equal( obj.setX(30), 2, 'original value is returned' );
    t.equal( obj.x, 30, 'property was set' );
    t.end();
});

test('type (typeof)', function (t) {
    var obj = { setX: o.writer('x', {type:'number'}) };
    t.throws( function(){ obj.setX('abc') }, 'string does not pass typeof number check' );
    obj.setX(24);
    t.equal( obj.x, 24, 'number passes typeof number check' );
    t.end();
});

test('type (function)', function (t) {
    var obj = {};
    obj.setX = o.writer('x', { type: function(val){ return (typeof val === 'number') ? true : false } });
    t.throws( function(){ obj.setX('abc') }, 'string does not pass function number check' );
    obj.setX(100);
    t.equal( obj.x, 100, 'number passes function number check' );
    t.end();
});

test('type (object)', function (t) {
    var obj = {};

    var fooType = o.numberType.subtype({
        coerce: function (val) { return (typeof val === 'number') ? (val + 1) : 0 }
    });

    obj.setX = o.writer('x', { type: fooType });
    t.throws( function(){ obj.setX('abc') }, 'string did not pass number' );
    obj.setX( 11 );
    t.is( obj.x, 11, 'coercion was not used' );

    obj.setX = o.writer('x', { type: fooType, coerce:true });
    obj.setX( 11 );
    t.is( obj.x, 12, 'coercion was used' );
    obj.setX( 'abc' );
    t.is( obj.x, 0, 'coercion was used' );

    t.end();
});

test('filter', function (t) {
    var obj = {};
    obj.setX = o.writer('x', {
        filter: function(val){ return val+1 },
        type: function(val){ return (val>=0) ? true : false }
    });
    obj.setX(-1);
    t.equal( obj.x, 0, 'filter filtered' );
    t.throws( function(){ obj.setX(-2) }, 'type was applied to filtered value' );
    t.end();
});

test('augments', function (t) {
    var A = function () { };
    var B = function () { };
    var obj = { setX: o.writer('x', {augments:A}) };
    obj.setX(new A());
    t.throws( function(){ obj.setX(new B()) }, 'augments check failed' );
    t.end();
});
