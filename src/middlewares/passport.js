const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = process.env;
const db = require("../models");
const ApiError = require("../classes/ApiError");

/**
 * 1- create new strategy,
 * 2- In JWT strategy it returns jwt token's payload which contains userID inside of the 'sub' property
 * 3- Check user and do operations
 */
//JWT Strategy - This is for generating new JWT token

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //this is gonna extract bearer token from req
			secretOrKey: JWT_SECRET,
		},
		async (payload, done) => {
			try {
				const user = await db.User.findById(payload.sub); //payload.sub = _id
				if (!user) throw new ApiError(401, "Unauthorized!");

				//No error,send user
				done(null, user);
			} catch (error) {
				console.log("Passport JWT strategy error: ", error);
				//Send error, no data(false)
				done(new ApiError(401, "Unauthorized"), false);
			}
		}
	)
);

/**
 * This middleware allows to access 'req.user'
 */

// LOCAL STRATEGY

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
		},
		async (email, password, done) => {
			try {
				const foundUser = await db.User.findOne({ email });
				if (!foundUser) throw new ApiError(400, "Invalid email ");

				const isPasswordsMatched = await foundUser.isValidPassword(
					password
				);

				if (!isPasswordsMatched)
					throw new ApiError(400, "Invalid password");

				//Send user if everything  is ok
				done(null, foundUser);
			} catch (error) {
				console.log("Passport local strategy error: ", error);
				done(error, false);
			}
		}
	)
);

module.exports = passport;
