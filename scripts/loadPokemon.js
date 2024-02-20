import mongoose from 'mongoose';
import config from '../src/config.js';
import connectDatabase from '../src/loaders/mongodb-loader.js';
import Move from '../src/models/move.js';
import Pokemon from '../src/models/pokemon.js';

async function fetchAndStorePokemon() {
  try {
    await connectDatabase(config.database);
    await Pokemon.deleteMany({});
    
    const allMoves = await Move.find({});

    for (let i = 1; i <= 150; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pokemon: ${response.statusText}`);
      }
      const pokemonData = await response.json();

      let selectedMoveIds = [];
      for (let j = 0; j < 4; j++) {
        const randomIndex = Math.floor(Math.random() * allMoves.length);
        selectedMoveIds.push(allMoves[randomIndex]._id);
      }

      const pokemon = new Pokemon({
        name: pokemonData.name,
        stats: {
          life: pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat,
          attack: pokemonData.stats.find(stat => stat.stat.name === 'attack').base_stat,
          defense: pokemonData.stats.find(stat => stat.stat.name === 'defense').base_stat,
          specialAttack: pokemonData.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
          specialDefense: pokemonData.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
          speed: pokemonData.stats.find(stat => stat.stat.name === 'speed').base_stat
        },
        types: pokemonData.types.map(type => type.type.name),
        moves: selectedMoveIds
      });

      await pokemon.save();
      console.log(`Pokemon ${pokemon.name} saved.`);
    }

    console.log('Finished storing Pokémon.');
  } catch (error) {
    console.error('Error fetching or storing Pokémon:', error);
  } finally {
    mongoose.connection.close();
  }
}

fetchAndStorePokemon();
