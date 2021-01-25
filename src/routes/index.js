const router = require("express").Router();
const usersRouter = require("./user");
const experienceRouter = require("./experience");

router.use("/users", usersRouter);
router.use("/experience", experienceRouter);

module.exports = router;
