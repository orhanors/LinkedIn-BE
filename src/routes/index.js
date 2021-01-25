const router = require("express").Router()
const usersRouter = require("./user")
const postsRouter = require("./posts")

router.use("/users", usersRouter)
router.use("/posts", postsRouter)

module.exports = router
