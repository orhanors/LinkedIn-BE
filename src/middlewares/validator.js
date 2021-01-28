const Joi = require("joi");

exports.commentSchema = Joi.object().keys({
	comment: Joi.string().min(1).required(),
	postId: Joi.required(),
	userId: Joi.required()

})

exports.postSchema = Joi.object().keys({
	text: Joi.string().min(1).required(),
	username: Joi.string().required(),
	user: Joi.required(), //TODO check this one
	likes: Joi.allow(),
	image: Joi.string()
		/* .pattern(
		/http?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
	), */
});
exports.experienceSchema = Joi.object().keys({
	user: Joi.string(),
	role: Joi.string().min(3).required(),
	company: Joi.string().min(3).required(),
	startDate: Joi.date().required(),
	endDate: Joi.date(),
	//username: Joi.string().required(),
	description: Joi.string().max(300),
	area: Joi.string(),
	image: Joi.string().pattern(
		/http?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
	),
});

exports.userSignupSchema = Joi.object().keys({
	name: Joi.string().min(1).required(),
	surname: Joi.string().required(),
	email: Joi.string().email().required(),
	username: Joi.string().min(3).required(),
	password: Joi.string().min(6).required(),
	bio: Joi.string().min(1),
	title: Joi.string().max(300),
	area: Joi.string().max(100),
	//experiences: Joi.exist(),
	image: Joi.string().pattern(
		/http?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
	),
});

exports.userEditSchema = Joi.object().keys({
	name: Joi.string().min(1).required(),
	surname: Joi.string().required(),
	email: Joi.string().email().required(),
	username: Joi.string().min(3).required(),
	bio: Joi.string().min(1),
	title: Joi.string().max(300),
	area: Joi.string().max(100),
	image: Joi.string(),
});

exports.userLoginSchema = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

// Generic validator function to check body
exports.validateBody = (schema) => {
	return (req, res, next) => {
		const { error } = schema.validate(req.body);

		if (error) {
			let originalErrorMessage = error.details[0].message;
			let modifiedErrorMessage =
				error.details[0].path +
				" " +
				originalErrorMessage.substring(
					originalErrorMessage.indexOf(" ") + 1
				);
			return res.status(400).json({ errors: modifiedErrorMessage });
		}

		if (!req.value) {
			req.value = {};
		}

		next();
	};
};
