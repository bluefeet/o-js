module.exports = function (obj) {
    if (Object.getPrototypeOf) return Object.getPrototypeOf(obj);
    return Object.__proto__; // jshint ignore:line
};
