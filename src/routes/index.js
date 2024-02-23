import express from 'express';
import combatRouter from './combat-router.js';
import miscRouter from './misc-router.js';
import userRouter from './user-router.js';

const router = express.Router();

router.use(userRouter);
router.use(miscRouter);
router.use('/combat', combatRouter);

export default router;
