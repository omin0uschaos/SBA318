function loggingMiddleware(req, res, next) {
    const { method, url, headers, body } = req;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${method} ${url}`);
    console.log(`Headers:`, headers);
    console.log(`Body:`, body);

    next();
}

module.exports = loggingMiddleware;