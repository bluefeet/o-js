var o_AllType = require('./o-AllType.js');
var o_integerType = require('./o-integerType.js');
var o_positiveType = require('./o-positiveType.js');

module.exports = new o_AllType([ o_integerType, o_positiveType ]);
