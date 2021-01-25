const router = require("express").Router();
const { signup, login } = require("../../controller/userController");
const {
	userSignupSchema,
	validateBody,
	userLoginSchema,
} = require("../../middlewares/validator");
const passport = require("../../middlewares/passport");
router.post("/auth/signup", validateBody(userSignupSchema), signup);
router.post(
	"/auth/login",
	validateBody(userLoginSchema),
	passport.authenticate("local", { session: false }),
	login
);

module.exports = router;
