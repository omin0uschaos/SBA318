function errorHandler(err, req, res, next) {
    console.error(err.stack);
    const options = {
        title: "Intergalactic Ship Registry",
        subTitle: `ERROR!`,
        content: `Sorry, looks like something broke!`
    };
    res.status(500).render("error", options);
}

module.exports = errorHandler;
