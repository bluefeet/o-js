var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var A = o.construct(
        function (x, y) { this.x=x; this.y=y },
        {
            getX: function () { return this.x },
            getY: function () { return this.y },
        }
    );
    var a = new A( 12, 4 );
    t.isDeeply( [a.getX(), a.getY()], [12, 4], 'worked' );
    t.end();
});
