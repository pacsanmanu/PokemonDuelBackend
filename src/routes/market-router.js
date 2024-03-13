import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import buyPokemon from '../controllers/market-controller.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/buy', buyPokemon);

export default router;
