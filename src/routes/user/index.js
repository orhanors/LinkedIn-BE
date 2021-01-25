const router = require("express").Router();
const { signup, login } = require("../../controller/userController");
const {
	userSignupSchema,
	validateBody,
	userLoginSchema,
} = require("../../middlewares/validator");

const passport = require("../../middlewares/passport");

// AUTH
router.post("/auth/signup", validateBody(userSignupSchema), signup);
router.post(
	"/auth/login",
	validateBody(userLoginSchema),
	passport.authenticate("local", { session: false }),
	login
);
//TEST ROUTE
router.get(
	"/secret",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		try {
			res.send("OK");
		} catch (error) {
			next(error);
		}
	}
);
module.exports = router;
