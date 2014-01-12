var o = require('../o');
var test = require('tap').test;

test( 'basic', function (t) {
    t.is( o.ucFirst('a'), 'A', 'a became A' );
    t.is( o.ucFirst('1'), '1', '1 became 1' );
    t.is( o.ucFirst('fooBar'), 'FooBar', 'fooBar became FooBar' );
    t.end();
});
