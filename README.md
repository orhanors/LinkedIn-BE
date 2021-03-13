# LinkedIn Web Clone Backend

LinkedIn web clone is a web application which is implemented using NodeJs,ExpressJs,PassportJs,JWT and MongoDB. Frontend side of this project can be found [here](https://github.com/orhanors/LinkedIn-FE/)

### Features

<details>
<summary><b> Authentication/Authorization </b></summary>
  </br>
    <p> This service includes auth/oauth implementation using jwt token strategy </p>
    <p> PassportJs used for auth implementation </p>
     <p> Here is the user model for this app: </p>
    
```javascript
   const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		username: { type: String },
		bio: { type: String },
		title: { type: String },
		area: { type: String },
		image: {
			type: String,
			default:
				"https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-24.jpg",
		},
		experiences: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
		],
		friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		friendRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamp: true }
);
```
</details>



<details>
<summary><b> Friendship </b></summary>
   <p> We don't use graph database for implementing friendship feature. I created a totally custom logic for friendship. </p>
   
```javascript
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
```

<p> friendRequests represents the friendship request for a spesific user. This is not a follow-unfollow implementation </p>
<p> Let's say user1 wants to be friend with user2. Here are the steps for implementing this feature: </p>

<strong>1.</strong> user1 sends a friend request to user2. This means that user2 should have user1's ID in his/her friendRequests list. This will also creates a notification for user2

```javascript
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
```
<strong>2.</strong> user2 has a friend notification which was added in step1 and comes from user2's friendRequests list. user2 can either accept or reject this request. 
In both situtaion user2 will lose user1 from friendsRequestList. If user2 accepts user1's frien request, both user will have the ID of other one.

Here are the both accept and reject request implementations:

```javascript
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

```

</details>

<details>
<summary><b> Post-Comment-Like-Profile-Experiences </b></summary>

<p> These features are contains CRUD operations for the related feature. Every one of them implemented carefully and tested on frontend side of the project </p>

</details>

