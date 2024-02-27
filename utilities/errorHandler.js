function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Sorry, looks like something broke!');
}

module.exports = errorHandler;
