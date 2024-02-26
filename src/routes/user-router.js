import { Router } from 'express';
import {getUsersController, createUserController, deleteUserController ,getUserMe} from '../controllers/user-controller.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = Router();
router.get('/', checkToken, getUsersController);
router.get('/me', checkToken, getUserMe);
router.post('/', createUserController);
router.delete('/:id', checkToken, deleteUserController);

export default router;