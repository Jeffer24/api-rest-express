function log(req, res, next) {
    console.log('Logging 2');
    next();
}

module.exports = log;