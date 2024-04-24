/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import logger from '../../utils/logger.js';
import calculateDamage from './damageCalculation.js';
import {
  updateUserCoins, increaseUserVictories, resetUserCoins, resetUserTeam, resetUserVictories,
  getUserById,
} from '../mongodb/user-db-service.js';

export default class Combat {
  constructor(player, ai, userId) {
    this.userId = userId;
    [this.playerPokemon] = player;
    this.player = player;
    [this.aiPokemon] = ai;
    this.ai = ai;
    this.turn = 0;
    this.combatId = Date.now().toString();
    this.winner = null;
    this.combatLog = [];
  }

  startCombat() {
    const startMessage = `Starting combat between ${this.playerPokemon.name} and ${this.aiPokemon.name}. The combat has started.`;
    logger.info(startMessage);
    logger.info(this.getCombatStatus());
    return this.getCombatStatus();
  }

  executeMove(attacker, defender, move) {
    const damage = calculateDamage(attacker, defender, move);
    defender.stats.life -= damage;
    const moveMessage = `${attacker.name} uses ${move.name}. ${move.name} does ${damage} damage to ${defender.name}. ${defender.name} now has ${defender.stats.life} HP.`;
    this.combatLog.push(moveMessage);
    return moveMessage;
  }

  executeAttack(moveIndex) {
    if (this.winner !== null) return 'Combat has already ended.';

    const playerMove = this.playerPokemon.moves[moveIndex];
    const aiMove = this.aiPokemon.moves[Math.floor(Math.random() * this.aiPokemon.moves.length)];

    let firstAttacker; let secondAttacker; let firstMove; let
      secondMove;
    if (this.playerPokemon.stats.speed >= this.aiPokemon.stats.speed) {
      firstAttacker = this.playerPokemon;
      secondAttacker = this.aiPokemon;
      firstMove = playerMove;
      secondMove = aiMove;
    } else {
      firstAttacker = this.aiPokemon;
      secondAttacker = this.playerPokemon;
      firstMove = aiMove;
      secondMove = playerMove;
    }

    let result = this.executeMove(firstAttacker, secondAttacker, firstMove);

    if (secondAttacker.stats.life > 0) {
      this.checkCombatEnded();
      result += ` ${this.executeMove(secondAttacker, firstAttacker, secondMove)}`;
    }

    if (this.aiPokemon.stats.life <= 0) {
      this.checkCombatEnded();
      const updateResult = this.updateActivePokemon();
      result += `\n${updateResult}`;
    }

    if (this.playerPokemon.stats.life <= 0) {
      this.checkCombatEnded();
      this.combatLog.push('Your Pokémon has fainted. Please select another Pokémon to continue the fight.');
    }

    logger.info(result);
    return this.getCombatStatus();
  }

  changePokemon(pokemonName, forcedChange) {
    const newActive = this.player.find((pokemon) => pokemon.name === pokemonName);

    if (!newActive || newActive.stats.life <= 0) {
      const message = 'Invalid selection or Pokémon unable to fight.';
      this.combatLog.push(message);
      return message;
    }

    this.playerPokemon = newActive;
    let result = `Switching to ${pokemonName}... Now, ${pokemonName} is in combat!`;
    this.combatLog.push(result);

    if (!forcedChange && this.aiPokemon.stats.life > 0) {
      const aiMove = this.aiPokemon.moves[Math.floor(Math.random() * this.aiPokemon.moves.length)];
      result += `\n${this.executeMove(this.aiPokemon, this.playerPokemon, aiMove)}`;
      this.checkCombatEnded();
    }

    logger.info(result);
    return this.getCombatStatus();
  }

  updateActivePokemon() {
    const nextPokemon = this.ai.find((pokemon) => pokemon.stats.life > 0);
    if (nextPokemon) {
      this.aiPokemon = nextPokemon;
      this.combatLog.push(`The AI switches to ${nextPokemon.name}.`);
    } else {
      return 'All AI Pokémon are defeated.';
    }
  }

  getCombatStatus() {
    return {
      combatId: this.combatId,
      userStatus: this.playerPokemon,
      aiStatus: this.aiPokemon,
      userTeam: this.player,
      aiTeam: this.ai,
      winner: this.winner,
      log: this.combatLog,
    };
  }

  checkCombatEnded() {
    if (this.player.every((pokemon) => pokemon.stats.life <= 0)) {
      this.winner = 'AI';
      this.combatLog.push('All player Pokémon are defeated. AI wins!');
    } else if (this.ai.every((pokemon) => pokemon.stats.life <= 0)) {
      this.winner = 'User';
      this.combatLog.push('All AI Pokémon are defeated. User wins!');
    }

    const baseCoinReward = 5;

    if (this.winner === 'User') {
      getUserById(this.userId)
        .then((user) => {
          const additionalCoins = Math.floor(user.victories / 3);
          const totalCoinReward = baseCoinReward + additionalCoins;
          increaseUserVictories(this.userId, 1);
          updateUserCoins(user._id, totalCoinReward)
            .then(() => {
              logger.info(`Usuario recompensado con ${totalCoinReward} monedas.`);
            })
            .catch((error) => {
              logger.error(`Error al actualizar las monedas del usuario: ${error.message}`);
            });
        })
        .catch((error) => {
          logger.error(`Error al obtener el usuario por ID: ${error}`);
        });
    } else if (this.winner === 'AI') {
      resetUserCoins(this.userId)
        .then(() => {
          logger.info('User coins reseted.');
        })
        .catch((error) => {
          logger.error(`Error updating user coins: ${error.message}`);
        });

      resetUserTeam(this.userId)
        .then(() => {
          logger.info('User team reseted.');
        })
        .catch((error) => {
          logger.error(`Error updating user coins: ${error.message}`);
        });

      resetUserVictories(this.userId)
        .then(() => {
          logger.info('User victories reseted.');
        })
        .catch((error) => {
          logger.error(`Error updating user coins: ${error.message}`);
        });
    }
  }
}
