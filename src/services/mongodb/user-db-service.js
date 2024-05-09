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

export async function getUserById(userId) {
  try {
    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      throw new Error(`Usuario con ID ${userId} no encontrado.`);
    }
    return user;
  } catch (error) {
    logger.error(`Error al obtener el usuario por ID: ${error}`);
    throw error;
  }
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

export async function addPokemonToUserTeam(id, pokemonName) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { team: pokemonName } },
      { new: true, safe: true, upsert: false },
    ).select('-password -__v');

    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found.`);
    }
    return updatedUser;
  } catch (error) {
    logger.error(`Error adding Pokemon to user's team: ${error}`);
    throw error;
  }
}

export async function increaseUserVictories(id, victories) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $inc: { victories } },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user victories: ${error}`);
    throw error;
  }
}

export async function resetUserTeam(id) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { team: [] },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user team: ${error}`);
    throw error;
  }
}

export async function resetUserCoins(id) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { coins: 0 },
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

export async function resetUserVictories(id) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { victories: 0 },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user victories: ${error}`);
    throw error;
  }
}

export async function deleteUser(id) {
  const user = await User.findByIdAndDelete(id);
  return user;
}
