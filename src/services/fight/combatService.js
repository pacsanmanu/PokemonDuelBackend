import readline from 'readline';
import calculateDamage from './damageCalculation.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Combat {
  constructor(player, ai) {
    this.player = player;
    this.playerPokemon = player[0];
    this.ai = ai;
    this.aiPokemon = ai[0];
    this.turn = 0;
  }

  startCombat() {
    console.log('The combat has started.');
    this.requestUserAction();
  }

  requestUserAction() {
    rl.question('What action would you like to perform? (attack/change) ', action => {
      if (action === 'attack') {
        this.listMoves();
      } else if (action === 'change') {
        this.listPokemonsForChange();
      } else {
        console.log('Unrecognized action, try again.');
        this.requestUserAction();
      }
    });
  }

  listMoves() {
    let string = 'Choose a move to attack: \n';
    this.playerPokemon.moves.forEach((move, index) => {
      string += `${index + 1}. ${move.name}\n`;
    });

    rl.question(string, index => {
      const moveIndex = parseInt(index) - 1;
      if (this.playerPokemon.moves[moveIndex]) {
        this.attack(this.playerPokemon.moves[moveIndex]);
      } else {
        console.log('Invalid move.');
        this.requestUserAction();
      }
    });
  }

  listPokemonsForChange() {
    let string = 'Choose a Pokémon to switch to: \n';
    this.player.forEach((pokemon, index) => {
      if (pokemon.stats.life > 0) {
        string += `${index + 1}. ${pokemon.name}\n`;
      }
    });

    rl.question(string, index => {
      const pokemonIndex = parseInt(index) - 1;
      if (this.player[pokemonIndex] && this.player[pokemonIndex].stats.life > 0) {
        this.change(this.player[pokemonIndex].name);
      } else {
        console.log('Invalid selection.');
        this.listPokemonsForChange();
      }
    });
  }

  attack(selectedMove) {
    console.log(`Attacking with ${selectedMove.name}...`);
    // Simulate AI move selection
    const aiMove = this.aiPokemon.moves[Math.floor(Math.random() * this.aiPokemon.moves.length)];
    // Execute player's attack
    this.executeMove(this.playerPokemon, selectedMove, this.aiPokemon);

    // Check if AI's Pokémon has fainted
    if (this.aiPokemon.stats.life <= 0) {
      console.log(`${this.aiPokemon.name} has fainted.`);
      if (!this.updateActivePokemon()) {
        return; // If no Pokémon left, end combat
      }
    }

    // Execute AI's attack if AI's Pokémon still has life
    if (this.aiPokemon.stats.life > 0) {
      this.executeMove(this.aiPokemon, aiMove, this.playerPokemon);
      // Check if player's Pokémon has fainted
      if (this.playerPokemon.stats.life <= 0) {
        console.log(`${this.playerPokemon.name} has fainted.`);
        this.listPokemonsForChange(); // Player chooses new Pokémon
      }
    }
  }

  executeMove(attacker, move, defender) {
    const damage = calculateDamage(attacker, move, defender); // Assuming calculateDamage function is implemented correctly
    defender.stats.life -= damage;
    console.log(`${attacker.name} used ${move.name}, causing ${damage} damage to ${defender.name}.`);

    if (!this.combatEnded()) {
      this.requestUserAction();
    }
  }

  change(pokemonName) {
    console.log(`Changing to ${pokemonName}...`);
    this.playerPokemon = this.player.find(pokemon => pokemon.name === pokemonName);
    this.requestUserAction();
  }

  updateActivePokemon() {
    const nextPokemon = this.ai.find(pokemon => pokemon.stats.life > 0);
    if (nextPokemon) {
      this.aiPokemon = nextPokemon;
      console.log(`The AI has changed to ${this.aiPokemon.name}.`);
      return true;
    } else {
      console.log("All AI Pokémon are defeated.");
      this.endCombat();
      return false;
    }
  }

  combatEnded() {
    if (this.player.every(pokemon => pokemon.stats.life <= 0) || this.ai.every(pokemon => pokemon.stats.life <= 0)) {
      this.endCombat();
      return true;
    }
    return false;
  }

  endCombat() {
    console.log('The combat has ended.');
    rl.close();
  }
}
