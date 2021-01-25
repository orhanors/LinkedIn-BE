const router = require("express").Router();
const usersRouter = require("./user");

router.use("/profile", usersRouter);

module.exports = router;
