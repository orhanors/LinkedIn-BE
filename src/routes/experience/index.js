const router = require("express").Router();
const {
	validateBody,
	experienceSchema,
} = require("../../middlewares/validator");
const {
	experiencePost,
	experienceDelete,
	experienceGetAll,
	experienceGetById,
	experiencePut,
	experienceGetCsv
} = require("../../controller/experienceController");

router.post(
	"/:userId/experiences",
	validateBody(experienceSchema),
	experiencePost
);
router.delete("/:userId/experiences/:expId", experienceDelete);

router.get("/:userId/experiences", experienceGetAll)

router.get("/:userId/experiences/:expId", experienceGetById)

router.put("/:userId/experiences/:expId", experiencePut)

router.get("/:userId/experiences/C/SV", experienceGetCsv)

module.exports = router;
