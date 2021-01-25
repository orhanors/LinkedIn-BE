const router = require("express").Router();
const { signup } = require("../../controller/userController");
const { userSchema, validateBody } = require("../../middlewares/validator");

router.post("/auth/signup", validateBody(userSchema), signup);

module.exports = router;
