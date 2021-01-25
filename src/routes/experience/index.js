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

module.exports = router;
