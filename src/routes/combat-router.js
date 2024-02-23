import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
const router = express.Router();

import {
  startCombat,
  performAttack,
  changePokemon,
  listAvailableMoves,
  listAvailablePokemons
} from '../controllers/combat-controller.js';

router.post('/start', startCombat);

router.post('/attack', performAttack);

router.post('/change', changePokemon);

router.get('/moves', listAvailableMoves);

router.get('/pokemons', listAvailablePokemons);

export default router;
