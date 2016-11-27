var o = require('./o-bootstrap.js');

var o_Trait = require('./o-Trait.js');

module.exports = o.liteAttributeTrait = new o_Trait({
    methods: {
        valueKey: function () { return this.key(); },
        reader: function () { return false; },
        writer: function () { return false; }
    }
});
