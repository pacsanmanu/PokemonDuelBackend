import readline from 'readline';
import calculateDamage from './damageCalculation.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Combat {
  constructor(player, ai) {
    this.player = player;
    this.playerPokemon = player[0]; // Asumiendo que el primer Pokémon es el activo
    this.ai = ai;
    this.aiPokemon = ai[0]; // Asumiendo que el primer Pokémon de la IA es el activo
    this.turn = 0;
    console.log(`Starting combat between ${this.playerPokemon.name} and ${this.aiPokemon.name}`);
  }

  startCombat() {
    console.log('The combat has started.');
    this.requestUserAction();
  }

  requestUserAction() {
    console.log(`It's your turn. ${this.playerPokemon.name} HP: ${this.playerPokemon.stats.life}`);
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
    console.log(`${this.playerPokemon.name}'s available moves:`);
    let string = '';
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
    console.log("Your available Pokémon for switch:");
    let string = '';
    this.player.forEach((pokemon, index) => {
      if (pokemon.stats.life > 0) {
        string += `${index + 1}. ${pokemon.name} (HP: ${pokemon.stats.life})\n`;
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
    console.log(`You chose to attack with ${selectedMove.name}.`);
    const aiMove = this.aiPokemon.moves[Math.floor(Math.random() * this.aiPokemon.moves.length)];
    console.log(`${this.aiPokemon.name} will counter with ${aiMove.name}.`);

    this.executeMove(this.playerPokemon, this.aiPokemon, selectedMove);

    if (this.aiPokemon.stats.life <= 0) {
      console.log(`${this.aiPokemon.name} has fainted.`);
      if (!this.updateActivePokemon()) {
        return;
      }
    }

    if (this.aiPokemon.stats.life > 0) {
      this.executeMove(this.aiPokemon, this.playerPokemon, aiMove);
      if (this.playerPokemon.stats.life <= 0) {
        console.log(`${this.playerPokemon.name} has fainted.`);
        this.listPokemonsForChange();
      }
    }
  }

  executeMove(attacker, defender, move) {
    console.log(`${attacker.name} uses ${move.name}.`);
    const damage = calculateDamage(attacker, defender, move);
    console.log(`${move.name} does ${damage} damage to ${defender.name}.`);
    defender.stats.life -= damage;

    console.log(`${defender.name} now has ${defender.stats.life} HP.`);
    if (defender.stats.life <= 0) {
      console.log(`${defender.name} fainted!`);
    }

    if (!this.combatEnded()) {
      this.requestUserAction();
    } else {
      this.endCombat();
    }
  }

  change(pokemonName) {
    console.log(`Switching to ${pokemonName}...`);
    this.playerPokemon = this.player.find(pokemon => pokemon.name === pokemonName);
    console.log(`Now, ${pokemonName} is in combat!`);
    this.requestUserAction();
  }

  updateActivePokemon() {
    console.log("Checking for the next AI Pokémon...");
    const nextPokemon = this.ai.find(pokemon => pokemon.stats.life > 0);
    if (nextPokemon) {
      this.aiPokemon = nextPokemon;
      console.log(`The AI switches to ${this.aiPokemon.name}.`);
      return true;
    } else {
      console.log("All AI Pokémon are defeated.");
      this.endCombat();
      return false;
    }
  }

  combatEnded() {
    if (this.player.every(pokemon => pokemon.stats.life <= 0)) {
      console.log("All your Pokémon have fainted. You lost the combat.");
      return true;
    } else if (this.ai.every(pokemon => pokemon.stats.life <= 0)) {
      console.log("All AI's Pokémon have fainted. You win the combat.");
      return true;
    }
    return false;
  }

  endCombat() {
    console.log('The combat has ended.');
    rl.close(); // Important to close the readline interface
  }
}

export default Combat;
