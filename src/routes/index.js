import express from 'express';
import login from '../controllers/login-controller.js';
import register from '../controllers/register-controller.js';
import miscRouter from './misc-router.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(miscRouter);

export default router;
