const ApiError = require("../classes/ApiError")
const db = require("../models")

exports.commentGet = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log("Comments GET controller error: ", error);
		next(error);
        
    }
}

exports.commentPost = async (req, res, next) => {
    try {
        /* const { postId } = req.params;
		const foundPost = await db.Post.findById(postId);
		if (!foundPost) throw new ApiError(404, "User");
		const newComment = await new db.Comment(req.body);
		newComment.postId = foundPost._id;
		await newComment.save();

		const editedPost = await db.Post.findByIdAndUpdate(userId, {
			$push: { comments: newComment._id },
		});
        res.status(201).json({ data: newComment }); */
        res.status(200).send("Okß")
        
    } catch (error) {
        console.log("Comments POST controller error: ", error);
		next(error);
        
    }
}

exports.commentPut = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log("Comments INSERTNAME controller error: ", error);
		next(error);
        
    }
}

exports.commentDelete = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log("Comments INSERTNAME controller error: ", error);
		next(error);
        
    }
}

exports.likePost = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log("Comments INSERTNAME controller error: ", error);
		next(error);
        
    }
}

exports.likeDelete = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log("Comments INSERTNAME controller error: ", error);
		next(error);
        
    }
}