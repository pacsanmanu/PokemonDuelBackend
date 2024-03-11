import express from 'express';
import combatRouter from './combat-router.js';
import miscRouter from './misc-router.js';
import userRouter from './user-router.js';
import login from '../controllers/login-controller.js';
import checkToken from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use('/login', login);
router.use('/users', userRouter);
router.use(miscRouter);
router.use('/combat', combatRouter);

router.post('/validate-token', checkToken, (req, res, next) => {
  try {
    res.status(200).json({ valid: true, user: req.user });
  } catch (error) {
    next(error);
  }
});

export default router;
