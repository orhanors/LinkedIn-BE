const router = require("express").Router()
const usersRouter = require("./user")
const postsRouter = require("./posts")
const experiencesRouter = require("./experience");
const commentsRouter = require("./comments")

router.use("/posts", postsRouter)
router.use("/profile", usersRouter);
router.use("/profile", experiencesRouter);
router.use("/posts", commentsRouter);


module.exports = router
