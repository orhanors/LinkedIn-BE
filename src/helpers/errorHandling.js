const badRequestHandler = (err, req, res, next) => {
	if (err.httpStatusCode === 400) {
		return res.status(400).json({ errors: err.message || "Bad Request!" });
	}
	next(err);
};

const notFoundHandler = (err, req, res, next) => {
	if (err.httpStatusCode === 404) {
		return res.status(404).json({
			errors: err.message
				? err.message + " " + "Not Found!"
				: "Not Found!",
		});
	}
	next(err);
};

const unAuthorizedHandler = (err, req, res, next) => {
	if (err.httpStatusCode === 401) {
		return res.status(401).json({ errors: err.message || "Unauthorized!" });
	}
	next(err);
};

const forbiddenHandler = (err, req, res, next) => {
	if (err.httpStatusCode === 403) {
		return res.status(403).json({ errors: err.message || "Forbidden!" });
	}
	next(err);
};

const genericHandler = (err, req, res, next) => {
	if (!res.headersSent) {
		return res
			.status(err.httpStatusCode || 500)
			.json({ errors: err.message || "Internal Server Error" });
	}
};

module.exports = {
	genericHandler,
	badRequestHandler,
	forbiddenHandler,
	unAuthorizedHandler,
	notFoundHandler,
};
