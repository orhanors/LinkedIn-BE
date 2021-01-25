const router = require("express").Router();
const { validateBody, experienceSchema } = require("../../middlewares/validator");
const {experience} = require("../../controller/experienceController")

router.post(validateBody(experienceSchema), experience)

router.post("/", async (req, res, next) => {
    
})


module.exports = router;

