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
/* 
//POST /users/:id/experiences
experiencesRouter.post("/:id/experiences", async (req, res, next) => {
  	try { 
		const experienceUsers = await ExperienceModel.findByIdAndUpdate(
		req.params.id,
		{
			$push: {
			experiences: {
				...req.body,
			},
			},
		}
		);
		res.status(201).send(experienceUsers);
	
	} catch (error) {
		next(error)
	}
}) */

module.exports = router;
