const ApiError = require("../classes/ApiError");
const { signJWT } = require("../helpers/jwt");
const db = require("../models");

//AUTH
exports.signup = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const foundUser = await db.User.findOne({ email });

		if (foundUser) throw new ApiError(400, "Email already exist");

		const newUser = new db.User({ ...req.body });
		await newUser.hashPassword();
		await newUser.save();

		const token = signJWT(newUser); //This is gonna generate a token which contains user ID
		res.status(201).json({ token });
	} catch (error) {
		console.log("Signup controller error", error);
		next(error);
	}
};

exports.login = async (req, res, next) => {
	try {
		//Passport middleware adds req.user
		const token = signJWT(req.user);
		res.status(201).json({ token, user: req.user });
	} catch (error) {
		console.log("Login controller error", error);
		next(error);
	}
};

//PROFILE
exports.profileGetAll = async (req, res, next) => {
	try {
		const allProfiles = await db.User.find({}, { password: 0 });
		res.status(200).json({ data: allProfiles });
	} catch (error) {
		console.log("Profile GETALL controller error", error);
		next(error);
	}
};

exports.profileGetSingle = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const foundProfile = await db.User.findById(userId, {
			password: 0,
		}).populate(["friends", "friendRequests", "experiences"]);
		if (!foundProfile) throw new ApiError(404, "User");
		res.status(200).json({ data: foundProfile });
	} catch (error) {
		console.log("Profile GETSINGLE controller error", error);
		if (error.name == "CastError") return next(new ApiError(404, "User"));
		next(error);
	}
};

exports.profileEdit = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const editedProfile = await db.User.findByIdAndUpdate(
			userId,
			{
				$set: { ...req.body },
			},
			{ new: true }
		);

		console.log("edited profile", editedProfile);
		res.status(201).json({ data: editedProfile });
	} catch (error) {
		console.log("Profile PUT controller error", error);
		if (error.name === "CastError") return next(new ApiError(404, "User"));
		next(error);
	}
};

exports.profileDelete = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const deletedProfile = await db.User.findByIdAndDelete(userId);
		if (!deletedProfile) throw new ApiError(404, "User");

		console.log("deleted Progile", deletedProfile);

		const deletedExps = await db.Experience.deleteMany({
			_id: { $in: deletedProfile.experiences },
		});
		res.status(200).json({ data: "Successfully deleted" });
	} catch (error) {
		console.log("Profile DELETE controller error", error);
		if (error.name === "CastError") return next(new ApiError(404, "User"));
		next(error);
	}
};

exports.profileUploadImage = async (req, res, next) => {
	try {
		const { userId } = req.params;

		const updatedUser = await db.User.findOneAndUpdate(
			{ _id: userId },
			{ $set: { image: req.file.path } },
			{ new: true }
		);
		console.log("updated user", updatedUser);
		if (!updatedUser) throw new ApiError(404, "User");
		res.status(201).json({ data: updatedUser });
	} catch (error) {
		console.log("Profile Image Upload error: ", error);
		next(error);
	}
};

//FRIENDSHIP
//TODO:Create a seperated function to handle same user exist check
exports.sendFriendRequest = async (req, res, next) => {
	try {
		const { currentUserId, requestedUserId } = req.params;
		//Find the users who are sending request (current) and receiving request (requested)
		const currentUser = await db.User.findById(currentUserId);
		const requestedUser = await db.User.findById(requestedUserId);
		const users = [currentUser, requestedUser];
		if (users.length === 0 || users.length === 1)
			throw new ApiError(404, "One or two user");

		console.log("users are: ", users);
		//Check if the current user is exist on requestedUser's "friendRequests" list
		for (let pendingUser of requestedUser.friendRequests) {
			if (pendingUser.toString() === currentUser._id.toString()) {
				throw new ApiError(400, "Request is already exists");
			}
		}

		//If the current user request is not exist,add requested user "friendRequests" array to current userId
		requestedUser.friendRequests.push(currentUser._id);
		await requestedUser.save();

		res.status(200).json({ data: "OK" });
	} catch (error) {
		console.log("Profile SEND friend request error: ", error);
		next(error);
	}
};

exports.acceptFriendRequest = async (req, res, next) => {
	try {
		const { currentUserId, requestedUserId } = req.params;
		//Find the users who are sending request (current) and receiving request (requested)
		const currentUser = await db.User.findById(currentUserId);
		const requestedUser = await db.User.findById(requestedUserId);
		const users = [currentUser, requestedUser];
		if (users.length === 0 || users.length === 1)
			throw new ApiError(404, "One or two user");

		//Check if the current user has a request from requested user
		const pendingUser = currentUser.friendRequests.find(
			(user) => user.toString() === requestedUser._id.toString()
		);

		if (!requestedUser) throw new ApiError(404, "Request");
		console.log("current is : ", currentUser);
		//Add as a friend to each user's "friends" list
		currentUser.friends.push(requestedUser._id);
		requestedUser.friends.push(currentUser._id);

		//Delete request from current user's "friendRequests" list
		currentUser.friendRequests = currentUser.friendRequests.filter(
			(user) => user.toString() !== requestedUser._id.toString()
		);

		Promise.all([await currentUser.save(), await requestedUser.save()])
			.then((result) => res.status(200).json({ data: "OK" }))
			.catch((e) => next(new ApiError()));
	} catch (error) {
		console.log("Profile ACCEPT friend request error: ", error);
		next(error);
	}
};

exports.rejectFriendRequest = async (req, res, next) => {
	try {
		const { currentUserId, requestedUserId } = req.params;
		//Find the users who are sending request (current) and receiving request (requested)
		const currentUser = await db.User.findById(currentUserId);
		const requestedUser = await db.User.findById(requestedUserId);
		const users = [currentUser, requestedUser];
		if (users.length === 0 || users.length === 1)
			throw new ApiError(404, "One or two user");

		//Delete requestedUser from currentUser's "friendRequests" list
		currentUser.friendRequests = currentUser.friendRequests.filter(
			(user) => user.toString() !== requestedUser._id.toString()
		);

		await currentUser.save();

		res.status(200).json({ data: "OK" });
	} catch (error) {
		console.log("Profile REJECT friend request error: ", error);
		next(error);
	}
};

exports.getFriendList = async (req, res, next) => {
	try {
		const { currentUserId } = req.params;

		const foundUser = await db.User.findOne(
			{ _id: currentUserId },
			{ friends: 1, _id: 0 }
		).populate({ path: "friends" });
		if (!foundUser) throw new ApiError(404, "User");
		res.status(200).json({ data: foundUser.friends });
	} catch (error) {
		console.log("Profile GET FRIENDLIST error: ", error);
		next(error);
	}
};
