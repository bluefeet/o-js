module.exports = function (key) {
    return function () {
        delete this[key];
    };
};
