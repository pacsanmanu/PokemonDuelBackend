import { Router } from 'express';
import {getUsersController, createUserController, deleteUserController ,getUserMe, updateUserController} from '../controllers/user-controller.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = Router();
router.post('/', createUserController);
router.get('/', checkToken, getUsersController);
router.get('/me', checkToken, getUserMe);
router.patch('/:id', checkToken, updateUserController);
router.delete('/:id', checkToken, deleteUserController);

export default router;