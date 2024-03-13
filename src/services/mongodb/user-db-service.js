import User from '../../models/user.js';
import logger from '../../utils/logger.js';

export async function getUserByName(username) {
  const user = await User.findOne({ username });
  return user;
}

export async function getUsers(filters) {
  const { name } = filters;
  const query = {
    username: name && { $regex: new RegExp(name, 'i') },
  };

  const cleanedQuery = Object.fromEntries(
    // eslint-disable-next-line no-unused-vars
    Object.entries(query).filter(([_, a]) => a !== undefined),
  );

  const users = await User.find(cleanedQuery).select('-password -__v');

  return users;
}

export async function createUser(user) {
  const userDoc = new User(user);
  const createdUser = await userDoc.save();
  return createdUser;
}

export async function updateUser(id, userUpdate) {
  const updatedUser = await User.findByIdAndUpdate(id, userUpdate, { new: true }).select('-password -__v');
  return updatedUser;
}

export async function updateUserCoins(id, coins) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $inc: { coins } },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user coins: ${error}`);
    throw error;
  }
}

export async function deleteUser(id) {
  const user = await User.findByIdAndDelete(id);
  return user;
}
