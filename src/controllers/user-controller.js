import { getUsers, createUser, deleteUser, getUserByName, updateUser } from '../services/mongodb/user-db-service.js';
import { encryptPassword } from '../utils/encrypt.js';

export async function getUsersController(req, res, next){
	try{
		const users = await getUsers(req.query);
		res.send(users);
	} catch (error){
		next(error);
	}
}

export async function getUserMe(req, res, next){
	try{
		const user = await getUserByName(req.user.username);
		const userObject = user.toObject();
		delete userObject.password;
		return res.send(userObject);
	} catch (error){
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

export async function deleteUserController(req, res, next){
	try{
		const user = await deleteUser(req.params.id);
		res.status(200).send(user);
	} catch (error){
		next(error);
	}
}
