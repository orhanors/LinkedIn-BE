const router = require("express").Router();
const {
	validateBody,
	experienceSchema,
} = require("../../middlewares/validator");
const {
	experiencePost,
	experienceDelete,
} = require("../../controller/experienceController");

router.post(
	"/:userId/experiences",
	validateBody(experienceSchema),
	experiencePost
);
router.delete("/:userId/experiences/:expId", experienceDelete);

module.exports = router;
