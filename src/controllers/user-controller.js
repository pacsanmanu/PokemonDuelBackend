/* eslint-disable consistent-return */
import {
  getUsers, createUser, deleteUser, getUserByName, updateUser, addPokemonToUserTeam, topVictoriesUsers,
} from '../services/mongodb/user-db-service.js';
import sellPokemon from '../services/userService.js';
import { encryptPassword } from '../utils/encrypt.js';
import logger from '../utils/logger.js';

export async function getUsersController(req, res, next) {
  try {
    const users = await getUsers(req.query);
    res.send(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserMe(req, res, next) {
  try {
    const user = await getUserByName(req.user.username);
    const userObject = user.toObject();
    delete userObject.password;
    return res.send(userObject);
  } catch (error) {
    next(error);
  }
}

export async function createUserController(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: 'Invalid email format' });
    }
    if (!usernameRegex.test(username)) {
      return res.status(400).send({ message: 'Username can only contain letters and numbers' });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).send({ message: 'Password can only contain letters and numbers' });
    }
    req.body.password = await encryptPassword(password);
    const user = await createUser(req.body);
    return res.status(201).send(user);
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
    } else if (error.message.includes('validation')) {
      error.status = 400;
    }
    next(error);
  }
}

export async function updateUserController(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const userId = req.params.id;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^[a-zA-Z0-9]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).send({ message: 'Invalid email format' });
    }
    if (username && !usernameRegex.test(username)) {
      return res.status(400).send({ message: 'Username can only contain letters and numbers' });
    }
    if (password && !passwordRegex.test(password)) {
      return res.status(400).send({ message: 'Password can only contain letters and numbers' });
    }
    if (password) {
      req.body.password = await encryptPassword(password);
    }
    const updatedUser = await updateUser(userId, req.body);
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(req, res, next) {
  try {
    const user = await deleteUser(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

export async function topVictoriesUsersController(req, res) {
  try {
    const topUsers = await topVictoriesUsers();
    res.status(200).send(topUsers);
  } catch (error) {
    logger.error(`Error al recuperar los usuarios con más victorias: ${error}`);
    res.status(500).send({ message: error.message });
  }
}

export async function addPokemonToUserTeamController(req, res) {
  const { userId, pokemonName } = req.body;

  if (!userId || !pokemonName) {
    return res.status(400).send({ message: 'User ID and Pokémon name are required.' });
  }

  try {
    const updatedUser = await addPokemonToUserTeam(userId, pokemonName);
    return res.status(200).send({
      message: 'Pokémon added successfully to your team.',
      team: updatedUser.team,
    });
  } catch (error) {
    logger.error(`Error adding Pokémon to user's team: ${error}`);
    res.status(500).send({ message: error.message });
  }
}

export const sellPokemonController = async (req, res, next) => {
  const { userId, pokemonIndex } = req.body;

  try {
    const index = parseInt(pokemonIndex, 10);
    if (Number.isNaN(index)) {
      return res.status(400).send({ message: 'Invalid Pokemon index' });
    }

    const updatedTeam = await sellPokemon(userId, index);
    res.status(200).send({ message: 'Pokemon removed successfully.', team: updatedTeam });
  } catch (error) {
    next(error);
  }
};
