import { Router } from 'express';
import { checkToken } from '../middlewares/auth-middleware.js';
import {
  getAllPokemonsController,
  getPokemonByNameController,
  getPokemonsByNamesController,
} from '../controllers/pokemon-controller.js';

const router = Router();
router.post('/all', checkToken, getAllPokemonsController);
router.post('/by-name', checkToken, getPokemonByNameController);
router.post('/by-names', checkToken, getPokemonsByNamesController);

export default router;
