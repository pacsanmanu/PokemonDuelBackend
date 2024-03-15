import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import { buyPokemonController, getMarketPokemonsController } from '../controllers/market-controller.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/buy', buyPokemonController);
router.post('/pokemons', getMarketPokemonsController);

export default router;
