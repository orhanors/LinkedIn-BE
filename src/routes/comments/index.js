const router = require("express").Router()


const {
    commentGet,
    commentPost,
    commentPut,
    commentDelete,
    likePost,
    likeDelete,
} = require("../../controller/commentsController") 
const { postSchema, commentSchema, validateBody } = require("../../middlewares/validator")

router.post("/:postId/comments", validateBody(commentSchema), commentPost)
router.get("/:postId/comments", commentGet)
router.put("/:postId/comments/:commentId", validateBody(commentSchema), commentPut)
router.delete("/:postId/comments/:commentId", commentDelete)
router.post("/:postId", validateBody(postSchema), likePost)
router.delete("/:postId", likeDelete)

module.exports = router