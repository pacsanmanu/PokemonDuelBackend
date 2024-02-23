import calculateDamage from './damageCalculation.js';

let forced;

class Combat {
  constructor(player, ai) {
    this.player = player;
    this.playerPokemon = player[0];
    this.ai = ai;
    this.aiPokemon = ai[0];
    this.turn = 0;
    console.log(`Starting combat between ${this.playerPokemon.name} and ${this.aiPokemon.name}`);
  }

  startCombat() {
    let initialState = {
      message: `El combate entre ${this.playerPokemon.name} y ${this.aiPokemon.name} ha comenzado.`,
      playerPokemon: {
        name: this.playerPokemon.name,
        life: this.playerPokemon.stats.life,
      },
      aiPokemon: {
        name: this.aiPokemon.name,
        life: this.aiPokemon.stats.life,
      }
    };
  
    return initialState;
  }
  

  listMoves() {
    return this.playerPokemon.moves.map((move, index) => ({
      index: index + 1,
      name: move.name,
      // Añade más detalles del movimiento si es necesario
    }));
  }
  

  listPokemonsForChange() {
    return this.player.filter(pokemon => pokemon.stats.life > 0).map((pokemon, index) => ({
      index: index + 1,
      name: pokemon.name,
      life: pokemon.stats.life,
      // Incluir más detalles del Pokémon si es necesario
    }));
  }
  

  attack(selectedMoveIndex) {
    const selectedMove = this.playerPokemon.moves[selectedMoveIndex];
    this.executeMove(this.playerPokemon, this.aiPokemon, selectedMove);

    let combatResult = {
      playerPokemon: this.playerPokemon,
      aiPokemon: this.aiPokemon,
      message: ""
    };

    if (this.aiPokemon.stats.life <= 0) {
      combatResult.message += `${this.aiPokemon.name} has fainted. `;
      if (!this.updateActivePokemon()) {
        combatResult.message += "Combat has ended.";
        return combatResult;
      }
    }

    if (this.aiPokemon.stats.life > 0) {
      const aiMove = this.aiPokemon.moves[Math.floor(Math.random() * this.aiPokemon.moves.length)];
      this.executeMove(this.aiPokemon, this.playerPokemon, aiMove);
    }

    if (this.combatEnded()) {
      combatResult.message += "Combat has ended.";
    }

    return combatResult;
  }

  executeMove(attacker, defender, move) {
    const damage = calculateDamage(attacker, defender, move);
    defender.stats.life -= damage;
  
    const moveResult = {
      message: `${attacker.name} usa ${move.name}. ${move.name} inflige ${damage} puntos de daño a ${defender.name}.`,
      attacker: {
        name: attacker.name,
        life: attacker.stats.life,
      },
      defender: {
        name: defender.name,
        life: defender.stats.life,
      }
    };
  
    if (defender.stats.life <= 0) {
      moveResult.message += ` ${defender.name} ha sido derrotado.`;
    }
  
    return moveResult;
  }
  

  change(pokemonName, forced) {
    console.log(`Switching to ${pokemonName}...`);
    this.playerPokemon = this.player.find(pokemon => pokemon.name === pokemonName);
    console.log(`Now, ${pokemonName} is in combat!`);

    if (!forced && this.aiPokemon.stats.life > 0) {
        const aiMove = this.aiPokemon.moves[Math.floor(Math.random() * this.aiPokemon.moves.length)];
        console.log(`${this.aiPokemon.name} seizes the moment to attack with ${aiMove.name}.`);
        this.executeMove(this.aiPokemon, this.playerPokemon, aiMove);
    }

    if (!this.combatEnded()) {
        this.requestUserAction();
    }
  }

  updateActivePokemon() {
    const nextPokemon = this.ai.find(pokemon => pokemon.stats.life > 0);
    
    if (nextPokemon) {
      this.aiPokemon = nextPokemon;
      return {
        message: `El adversario cambia a ${this.aiPokemon.name}.`,
        aiPokemon: this.aiPokemon
      };
    } else {
      return {
        message: "Todos los Pokémon del adversario han sido derrotados. ¡Has ganado el combate!",
        aiPokemon: null
      };
    }
  }
  

  combatEnded() {
    const playerDefeated = this.player.every(pokemon => pokemon.stats.life <= 0);
    const aiDefeated = this.ai.every(pokemon => pokemon.stats.life <= 0);
  
    if (playerDefeated || aiDefeated) {
      let message = "";
      if (playerDefeated) {
        message = "Todos tus Pokémon han sido derrotados. Has perdido el combate.";
      } else if (aiDefeated) {
        message = "Todos los Pokémon del adversario han sido derrotados. ¡Has ganado el combate!";
      }
  
      return {
        ended: true,
        message,
        winner: playerDefeated ? "AI" : "Player"
      };
    }
  
    return {
      ended: false,
      message: "",
      winner: null
    };
  }
  
}

export default Combat;