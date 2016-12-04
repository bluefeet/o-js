//var o = require('../lib/o.js');
var o = {};
o.prependIdentifier = require('../lib/o-prependIdentifier.js');
var test = require('tap').test;

test( 'basic', function (t) {
    t.is( o.prependIdentifier('','a'), 'a', ',a became a' );
    t.is( o.prependIdentifier('_','a'), '_a', '_,a became _a' );
    t.is( o.prependIdentifier('a','b'), 'aB', 'a,b became aB' );
    t.is( o.prependIdentifier('_a','b'), '_aB', '_a,b became _aB' );
    t.is( o.prependIdentifier('a','_b'), '_aB', 'a,_b became _aB' );
    t.is( o.prependIdentifier('_a','_b'), '_aB', '_a,_b became _aB' );
    t.end();
});
