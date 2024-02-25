import calculateDamage from "./damageCalculation.js";

export default class Combat {
  constructor(player, ai) {
    this.player = player;
    this.playerPokemon = player[0];
    this.ai = ai;
    this.aiPokemon = ai[0];
    this.turn = 0;
    this.combatId = Date.now().toString();
  }

  startCombat() {
    const startMessage = `Starting combat between ${this.playerPokemon.name} and ${this.aiPokemon.name}. The combat has started.`;
    return startMessage;
  }

  executeMove(attacker, defender, move) {
    const damage = calculateDamage(attacker, defender, move);
    defender.stats.life -= damage;
  
    return `${attacker.name} uses ${move.name}. ${move.name} does ${damage} damage to ${defender.name}. ${defender.name} now has ${defender.stats.life} HP.`;
  }
  
  executeAttack(moveIndex) {
    const playerMove = this.playerPokemon.moves[moveIndex];
    const aiMove = this.aiPokemon.moves[Math.floor(Math.random() * this.aiPokemon.moves.length)];
  
    let firstAttacker, secondAttacker, firstMove, secondMove;
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
      result += " " + this.executeMove(secondAttacker, firstAttacker, secondMove);
    }
  
    if (this.aiPokemon.stats.life <= 0) {
      const updateResult = this.updateActivePokemon();
      result += `\n${updateResult}`;
    }
  
    return result;
  }

  changePokemon(pokemonName, forcedChange) {
    const newActive = this.player.find(pokemon => pokemon.name === pokemonName);
    
    if (!newActive || newActive.stats.life <= 0) {
      return "Invalid selection or Pokémon unable to fight.";
    }
  
    this.playerPokemon = newActive;
    let result = `Switching to ${pokemonName}... Now, ${pokemonName} is in combat!`;
  
    if (!forcedChange && this.aiPokemon.stats.life > 0) {
      const aiMove = this.aiPokemon.moves[Math.floor(Math.random() * this.aiPokemon.moves.length)];
      result += "\n" + this.executeMove(this.aiPokemon, this.playerPokemon, aiMove);
    }
  
    return result;
  }
  
  updateActivePokemon() {
    const nextPokemon = this.ai.find(pokemon => pokemon.stats.life > 0);
    if (nextPokemon) {
      this.aiPokemon = nextPokemon;
      return `The AI switches to ${nextPokemon.name}.`;
    } else {
      return "All AI Pokémon are defeated.";
    }
  }

  getCombatStatus() {
    const userStatus = this.player.map(pokemon => ({
      name: pokemon.name,
      life: pokemon.stats.life
    }));
  
    const aiStatus = this.ai.map(pokemon => ({
      name: pokemon.name,
      life: pokemon.stats.life
    }));
  
    const fighting = {
      userPokemon: {
        name: this.playerPokemon.name,
        life: this.playerPokemon.stats.life
      },
      aiPokemon: {
        name: this.aiPokemon.name,
        life: this.aiPokemon.stats.life
      }
    };
  
    return {
      UserStatus: userStatus,
      AIStatus: aiStatus,
      Fighting: fighting
    };
  }
  
  

  combatEnded() {
    if (this.player.every(pokemon => pokemon.stats.life <= 0)) {
      return "All your Pokémon have fainted. You lost the combat.";
    } else if (this.ai.every(pokemon => pokemon.stats.life <= 0)) {
      return "All AI's Pokémon have fainted. You win the combat.";
    }
    return false;
  }
}