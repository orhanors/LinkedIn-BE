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
	experienceGetCsv,
	experienceUploadImage,
} = require("../../controller/experienceController");
const cloudinaryMulter = require("../../middlewares/cloudinary");
router.post(
	"/:userId/experiences",
	validateBody(experienceSchema),
	experiencePost
);
router.delete("/:userId/experiences/:expId", experienceDelete);

router.get("/:userId/experiences/export/CSV", experienceGetCsv);
router.get("/:userId/experiences", experienceGetAll);

router.get("/:userId/experiences/:expId", experienceGetById);

router.put("/:userId/experiences/:expId", experiencePut);

router.post(
	"/:userId/experiences/:expId/picture",
	cloudinaryMulter.single("experience"),
	experienceUploadImage
);

module.exports = router;
