import { Server } from 'socket.io';
import Combat from './fight/combatService.js';
import { getPokemonsByNames } from './mongodb/pokemon-db-service.js';
import logger from '../utils/logger.js';

let io = null;

function setupCombatEvents(socket) {
  socket.on('joinCombat', (data) => {
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
  });

  socket.on('startCombat', async (data) => {
    const { player, ai } = data;
    try {
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
  });

  socket.on('executeAttack', (data) => {
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
  });

  socket.on('changePokemon', (data) => {
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
  });
}

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3001',
    },
  });

  io.on('connection', (socket) => {
    logger.info('Un usuario se ha conectado.');
    setupCombatEvents(socket);
  });
}

export default initSocket;
