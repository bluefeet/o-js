var o = require('../o');
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

test('chain', function (t) {
    var obj = { setX: o.writer('x', {chain:true}) };
    t.equal( obj.setX(32), obj, 'chain returned context' );
    t.equal( obj.x, 32, 'property was set with chain' );
    t.end();
});
