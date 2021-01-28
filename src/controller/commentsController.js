const ApiError = require("../classes/ApiError")
const mongoose = require("mongoose");
const db = require("../models")
const { User, Post, Comment, Like} = require("../models");

exports.commentGet = async (req, res, next) => {
    try {
        const findPost = await db.Post.findOne({
			_id: req.params.postId,
        }).populate("comments")
		res.status(200).json({ data: findPost });
    } catch (error) {
        console.log("Comments GET controller error: ", error);
		next(error);
        
    }
}

exports.commentPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
		const foundPost = await db.Post.findById(postId);
		if (!foundPost) throw new ApiError(404, "Post");
		const newComment = await new db.Comment(req.body);
		newComment.postId = foundPost._id;
		await newComment.save();
		const editedPost = await db.Post.findByIdAndUpdate(postId, {
			$push: { comments: newComment._id },
		});
        res.status(201).json({ data: newComment }); 
    } catch (error) {
        console.log("Comments POST controller error: ", error);
		next(error);
    }
}

exports.commentPut = async (req, res, next) => {
    try {
        const findComment = await db.Comment.findByIdAndUpdate(
			req.params.commentId,
			req.body
        );
        console.log(findComment)
        if (findComment)
            res.status(200).json({ data: findComment });
		else throw new ApiError(404, "Comment");
    } catch (error) {
        console.log("Comments PUT controller error: ", error);
		next(error);
    }
}

exports.commentDelete = async (req, res, next) => {
    try {
        const editedComment = await db.Post.findOneAndUpdate(
			{
				_id: req.params.postId,
			},
			{ $pull: { comments: req.params.commentId } }
		);
		res.status(200).json({
			data: `Comment # ${req.params.commentId} deleted`,
		});
    } catch (error) {
        console.log("Comments DELETE controller error: ", error);
		next(error);
    }
}

exports.likePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        
		/* const foundPost = await db.Post.findByIdAndUpdate(postId,{
            $push: {
                likes: {
                ...req.body,
                },
            },
        });
        res.status(201).send(foundPost) */

        const foundPost = await db.Post.findById(postId);
        /* console.log(foundPost)
        console.log(foundPost.likes)
        console.log(foundPost.likes[1]) */
        console.log(req.body.userId)
        let cazzoPost = foundPost.likes
        for (let i = 0; i < cazzoPost.length; i++) {
            console.log(cazzoPost[i].userId)

            if (cazzoPost[i].userId != req.body.userId) {
                console.log("true")
                await db.Post.Update( {
                    $push: {
                        likes: {
                            ...req.body,
                        },
                    },
            });
            res.status(201).send(shitPost); 
            } else { console.log("false")}
        }
        /* if (minchiaPost.length===0)
        {
            const shitPost = await db.Post.findByIdAndUpdate(postId, {
                    $push: {
                        likes: {
                            ...req.body,
                        },
                    },
            });
            res.status(201).send(shitPost); 
            } */


        /* for (i = 0; i < foundPost.likes.length; i++) {
            console.log(foundPost.likes[i].userId)
            if (foundPost.likes[i].userId !== req.body.userId) {
                const shitPost = await db.Post.findByIdAndUpdate(postId, {
                    $push: {
                        likes: {
                            ...req.body,
                        },
                    },
                });
                res.status(201).send(shitPost);  */
            /* else { 
                    const foundPost = await db.Like.findOneAndUpdate(
                    {
                        _id: req.params.postId,
                    },{
                    $pull: {
                        likes: req.body.userId
                        },
                    }); */
                res.status(201).send("No");
                //const foundPost = await db.Like.deleteOne({ likes: { $gte: 10 } })
                
                //console.log("No")
        
        
    } catch (error) {
        console.log("Comments LIKE POST controller error: ", error);
		next(error);
    }
}

exports.likeDelete = async (req, res, next) => {
    try {
        const editedLikes = await db.Post.findOneAndUpdate(
			{
				_id: req.params.postId,
			},
            { $pull: { likes: req.params } }
            //req.params.likeId before
		);
		res.status(200).json({
			data: `Likes #deleted`,
		});
    } catch (error) {
        console.log("Comments LIKE DELETE controller error: ", error);
		next(error);
        
    }
}