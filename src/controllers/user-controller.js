import { getUsers, createUser, deleteUser, getUserByName } from '../services/mongodb/user-db-service.js';
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

export async function createUserController(req, res, next){
	try{
		const body = req.body;
		body.password = await encryptPassword(body.password);	
		const users = await createUser(req.body);
		return res.status(201).send(users);
	} catch (error){
		if(error.code === 11000){
			error.status = 409;
		}
		if(error.message.includes('validation')){
			error.status = 400;
		}
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
