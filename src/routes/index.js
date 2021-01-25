const router = require("express").Router();
const usersRouter = require("./user");
const experiencesRouter = require("./experience");


router.use("/profile", usersRouter);


router.use("/profile", experiencesRouter);


module.exports = router;
