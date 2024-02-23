import User from '../../models/user.js';

export async function getUserByEmail(email) {
	return await User.findOne({ email });
}