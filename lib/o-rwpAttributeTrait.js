var o = require('./o-bootstrap.js');

var o_Trait = require('./o-Trait.js');
var o_prependIdentifier = require('./o-prependIdentifier.js');
var o_AnyType = require('./o-AnyType.js');
var o_booleanType = require('./o-booleanType.js');
var o_identifierType = require('./o-identifierType.js');

var booleanOrIdentifierType = new o_AnyType([
    o_booleanType,
    o_identifierType
]);

module.exports = o.rwpAttributeTrait = new o_Trait({
    attributes: {
        writer: {
            type: booleanOrIdentifierType,
            devoid: function () { return o_prependIdentifier('_',this.reader); }
        }
    }
});
