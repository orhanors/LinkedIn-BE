const router = require("express").Router()
const {
  post,
  get,
  getSinglePost,
  modifyPost,
  deletePost,
  postImage,
} = require("../../controller/postsController")
const { postSchema, validateBody } = require("../../middlewares/validator")

router.post("/", validateBody(postSchema), post)
router.get("/", get)
router.get("/:postId", getSinglePost)
router.put("/:postId", validateBody(postSchema), modifyPost)
router.delete("/:postId", deletePost)
router.post("/:postId", postImage)

module.exports = router
