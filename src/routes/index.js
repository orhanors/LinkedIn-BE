const router = require("express").Router()
const usersRouter = require("./user")
const postsRouter = require("./posts")
const experiencesRouter = require("./experience");

router.use("/posts", postsRouter)
router.use("/profile", usersRouter);
router.use("/profile", experiencesRouter);


module.exports = router
