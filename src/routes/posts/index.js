const router = require("express").Router()
const { post } = require("../../controller/postsController")
const { postSchema, validateBody } = require("../../middlewares/validator")

router.post("/", validateBody(postSchema), post)

module.exports = router
