const router = require("express").Router();
const {
	validateBody,
	experienceSchema,
} = require("../../middlewares/validator");
const {
	experiencePost,
	experienceDelete,
	experienceGetAll,
	experienceGetById
} = require("../../controller/experienceController");

router.post(
	"/:userId/experiences",
	validateBody(experienceSchema),
	experiencePost
);
router.delete("/:userId/experiences/:expId", experienceDelete);

router.get("/:userId/experiences", experienceGetAll)

router.get("/:userId/experiences/:expId", experienceGetById)


module.exports = router;
