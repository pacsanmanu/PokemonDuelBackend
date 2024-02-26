import express from 'express';
import combatRouter from './combat-router.js';
import miscRouter from './misc-router.js';
import userRouter from './user-router.js';
import login from '../controllers/login-controller.js';

const router = express.Router();

router.use('/login', login)
router.use('/users', userRouter);
router.use(miscRouter);
router.use('/combat', combatRouter);

export default router;
