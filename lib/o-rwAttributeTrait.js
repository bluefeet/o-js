var o = require('./o-bootstrap.js');

var o_Trait = require('./o-Trait.js');

module.exports = o.rwAttributeTrait = new o_Trait({
    methods: {
        writer: function () { return this.key(); }
    }
});
