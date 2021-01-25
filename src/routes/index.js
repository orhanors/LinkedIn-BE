const router = require("express").Router();
const usersRouter = require("./user");
const experiencesRouter = require("./experience");


router.use("/profile", usersRouter);

router.use("/users", usersRouter);
router.use("/users/userName/experiences", experiencesRouter);


module.exports = router;
