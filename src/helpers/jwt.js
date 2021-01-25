const JWT = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

/**
 * @param {Object} newUser
 */
exports.signJWT = (payload) => {
	const modifiedPayload = {
		iss: "linkedin",
		sub: payload._id,
		iat: new Date().getTime(),
		exp: new Date().setDate(new Date().getDate() + 10), //10 days later
	};

	return JWT.sign(modifiedPayload, JWT_SECRET);
};
