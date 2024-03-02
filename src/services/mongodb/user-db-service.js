import User from '../../models/user.js';

export async function getUserByName(username){
	const user = await User.findOne({username});
	return user;
}

export async function getUsers(filters){
	const { name } = filters;
	const query = {
		username: name && { $regex: new RegExp(name, 'i')}
	};
	
	const cleanedQuery = Object.fromEntries(
		Object.entries(query).filter(([_, a]) => a !== undefined)
	);

	const users = await User.find(cleanedQuery).select('-password -__v');

	return users;
}

export async function createUser(user){
	const userDoc = new User(user);
	const createdUser = await userDoc.save();
	return createdUser;
}

export async function deleteUser(id){
	const user = await User.findByIdAndDelete(id);
	return user;
}