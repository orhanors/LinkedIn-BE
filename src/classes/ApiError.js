class ApiError {
	constructor(httpStatusCode = 500, message, isOperational = true) {
		this.httpStatusCode = httpStatusCode;
		this.message = message;
		this.isOperational = isOperational || this.httpStatusCode === 500;
	}
}

module.exports = ApiError;
