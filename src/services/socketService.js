/* eslint-disable no-use-before-define */
import Combat from './fight/combatService.js';
import { getPokemonsByNames } from './mongodb/pokemon-db-service.js';
import logger from '../utils/logger.js';

function setupCombatEvents(io, socket) {
  logger.info('Setting up events');
  socket.on('combatAction', async (message) => {
    const { action, data } = message;

    switch (action) {
      case 'joinCombat':
        joinCombat(data);
        break;

      case 'startCombat':
        await startCombat(data);
        break;

      case 'executeAttack':
        executeAttack(data);
        break;

      case 'changePokemon':
        changePokemon(data);
        break;

      default:
        logger.info('Acción no reconocida.');
        socket.emit('error', { message: `Acción '${action}' no reconocida.` });
        break;
    }
  });

  async function startCombat(data) {
    const { player, ai } = data;
    try {
      logger.info('Iniciando combate');
      const [playerPokemons, aiPokemons] = await Promise.all([getPokemonsByNames(player), getPokemonsByNames(ai)]);
      const combat = new Combat(playerPokemons, aiPokemons);
      const { combatId } = combat;

      global.combats = global.combats || {};
      global.combats[combatId] = combat;

      socket.join(combatId);
      io.to(combatId).emit('combatStarted', { combatId, ...combat.startCombat() });
    } catch (error) {
      socket.emit('error', { message: 'Error starting combat', error: error.message });
    }
  }

  async function joinCombat(data) {
    const { combatId } = data;
    const combat = global.combats[combatId];
    if (combat) {
      socket.join(combatId);
      logger.info(`Socket ${socket.id} se ha unido al combate ${combatId}`);

      io.to(combatId).emit('playerJoined', { message: `Un nuevo jugador se ha unido al combate ${combatId}.` });

      socket.emit('combatState', combat.getCombatStatus());
    } else {
      socket.emit('error', { message: `No se encontró el combate con ID ${combatId}` });
    }
  }

  async function executeAttack(data) {
    const { combatId, moveIndex } = data;
    const combat = global.combats[combatId];
    if (!combat) {
      socket.emit('error', { message: 'Combat not found' });
      return;
    }

    try {
      const result = combat.executeAttack(moveIndex);
      io.to(combatId).emit('attackExecuted', { result, combatStatus: combat.getCombatStatus() });
    } catch (error) {
      socket.emit('error', { message: 'Error executing attack', error: error.message });
    }
  }

  async function changePokemon(data) {
    const { combatId, pokemonName, forcedChange = false } = data;
    const combat = global.combats[combatId];
    if (!combat) {
      socket.emit('error', { message: 'Combat not found' });
      return;
    }

    try {
      const result = combat.changePokemon(pokemonName, forcedChange);
      io.to(combatId).emit('pokemonChanged', { result, combatStatus: combat.getCombatStatus() });
    } catch (error) {
      socket.emit('error', { message: 'Error changing Pokémon', error: error.message });
    }
  }
}

export default setupCombatEvents;
