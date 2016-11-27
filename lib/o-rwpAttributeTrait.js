var o = require('./o-bootstrap.js');

var o_Trait = require('./o-Trait.js');
var o_ucFirst = require('./o-ucFirst.js');

module.exports = o.rwpAttributeTrait = new o_Trait({
    methods: {
        writer: function () { return '_set' + o_ucFirst( this.key() ); }
    }
});
