module.exports = function (key, method) {
    return function () {
        return this[key][method].apply( this[key], arguments );
    };
};
