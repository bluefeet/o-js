var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var obj = { getX: o.reader('x') };
    t.equal( obj.getX(), undefined, 'property is undefined' );
    obj.x = 'foo';
    t.equal( obj.getX(), 'foo', 'property was read' );
    t.end();
});

test('required', function (t) {
    var obj = { getX: o.reader('x', { required: true }) };
    t.throws( function(){ obj.getX() }, 'throws when required' );
    obj.x = 11;
    t.equal( obj.getX(), 11, 'property was read with required set' );
    t.end();
});

test('devoid (value)', function (t) {
    var obj = { getX: o.reader('x', {devoid:183}) };
    t.equal( obj.getX(), 183, 'value devoid was applied' );
    obj.x = 68;
    t.equal( obj.getX(), 68, 'value devoid was bypassed by explicit value' );
    t.end();
});

test('devoid (function)', function (t) {
    var obj = { getX: o.reader('x', {devoid: function(){ return 90 }}) };
    t.equal( obj.getX(), 90, 'function devoid was applied' );
    obj.x = 43;
    t.equal( obj.getX(), 43, 'function devoid was bypassed by explicit value' );
    t.end();
});

test('devoid (function that returns a function)', function (t) {
    var obj = {};
    obj.getX = o.reader('x', {devoid: function(){ return function(){ return 'y' } }});
    t.equal( obj.getX()(), 'y', 'devoid can return a function' );
    t.end();
});

test('devoid (required has precedence)', function (t) {
    var obj = { getX: o.reader('x', {required:true, devoid:25}) };
    t.throws( function(){ obj.getX() }, 'required is evaluated before devoid' );
    t.end();
});

test('devoid + writer', function (t) {
    var obj = {};
    var setX = o.writer('x');
    var writerCalled = false;
    obj.getX = o.reader('x', {
        writer: function () { writerCalled = true; return setX.apply(this, arguments) },
        devoid: 6
    });
    t.equal( obj.getX(), 6, 'devoid was set with writer set' );
    t.ok( writerCalled, 'the custom writer was called' );
    t.end();
});

test('writer (definition pass-through)', function (t) {
    var obj = {};
    obj.getX = o.reader('x', { type:'number', devoid:16 });
    t.equal( obj.getX(), 16, 'devoid was set with writer and passed type check' );
    obj.getY = o.reader('y', { type:'number', devoid:'abc' });
    t.throws( function(){ obj.getY() }, 'devoid value failed type check' );
    t.end();
});

test('predicate', function(t) {
    var obj = {};
    var hasX = o.predicate('x');
    var predicateCalled = false;
    obj.getX = o.reader('x', {
        predicate: function () { predicateCalled = true; return hasX.call(this) },
    });
    t.equal( obj.getX(), undefined, 'property is undefeind with predicate set' );
    t.ok( predicateCalled, 'the custom predicate was called' );
    obj.x = 18;
    t.equal( obj.getX(), 18, 'property was read with predicate set' );
    t.end();
});
