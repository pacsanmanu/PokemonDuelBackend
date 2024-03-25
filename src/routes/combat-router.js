import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import {
  startCombat,
  executeAttack,
  changePokemon,
  deleteCombat,
  AiTeamController,
} from '../controllers/combat-controller.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/ai-team', AiTeamController);
router.post('/start', startCombat);
router.post('/attack', executeAttack);
router.post('/change', changePokemon);
router.delete('', deleteCombat);

export default router;
