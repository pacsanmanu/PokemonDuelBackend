import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
const router = express.Router();

import {
  startCombat,
  executeAttack,
  changePokemon,
  deleteCombat
} from '../controllers/combat-controller.js';

//router.use(authMiddleware);

router.post('/start', startCombat);
router.post('/attack', executeAttack);
router.post('/change', changePokemon);
router.delete('/delete', deleteCombat);

export default router;
