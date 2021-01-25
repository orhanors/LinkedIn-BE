const Joi = require("joi")

exports.userSchema = Joi.object().keys({
  name: Joi.string().min(1).required(),
  surname: Joi.string().required(),
  email: Joi.string().email().required(),
})

exports.postSchema = Joi.object().keys({
  text: Joi.string().min(1).required(),
  username: Joi.string().required(),
  user: Joi.string().required(), //TODO check this one
})

// Generic validator function to check body
exports.validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)

    if (error) {
      let originalErrorMessage = error.details[0].message
      let modifiedErrorMessage =
        error.details[0].path +
        " " +
        originalErrorMessage.substring(originalErrorMessage.indexOf(" ") + 1)
      return res.status(400).json({ errors: modifiedErrorMessage })
    }

    if (!req.value) {
      req.value = {}
    }

    next()
  }
}
