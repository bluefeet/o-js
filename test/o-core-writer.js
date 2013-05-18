var o = require('o-core');
require('../o-types');
var test = require('tap').test;

test('basic', function (t) {
    var obj = {};

    obj.setX = o.writer( 'x', { type:o.positiveType } );
    t.throws(function(){ obj.setX(-1) }, 'failed validation');

    obj.setX(1);
    t.equal( obj.x, 1, 'passed validation' );

    t.end();
});
