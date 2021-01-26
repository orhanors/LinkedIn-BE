const router = require("express").Router()
const {
  validateBody,
  experienceSchema,
} = require("../../middlewares/validator")
const {
  experiencePost,
  experienceDelete,
  getExperience,
} = require("../../controller/experienceController")

router.post(
  "/:userId/experiences",
  validateBody(experienceSchema),
  experiencePost
)
router.delete("/:userId/experiences/:expId", experienceDelete)
router.get("/:userId/experiences/:expId", getExperience)

module.exports = router
