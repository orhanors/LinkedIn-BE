const router = require("express").Router()
const cloudinaryMulter = require("../../middlewares/cloudinary")

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
router.post("/:postId", cloudinaryMulter.single("image"), postImage)

module.exports = router
