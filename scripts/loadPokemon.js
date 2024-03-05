import mongoose from 'mongoose';
import config from '../src/config.js';
import connectDatabase from '../src/loaders/mongodb-loader.js';
import Move from '../src/models/move.js';
import Pokemon from '../src/models/pokemon.js';
import nombres from './nombres.js';

async function fetchAndStorePokemon() {
  try {
    await connectDatabase(config.database);
    await Pokemon.deleteMany({});

    const allMoves = await Move.find({});
    const movesMap = new Map(allMoves.map(move => [move.name, move]));

    for (let i = 0; i < nombres.length; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombres[i]}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pokemon: ${response.statusText}`);
      }
      const pokemonData = await response.json();
    
      let movesDetails = [];
      if (pokemonData.moves.length >= 4) {
        const pokemonTypes = pokemonData.types.map(type => type.type.name);
        // Previamente mapeados los detalles de los movimientos, no necesitamos llamadas adicionales aquí

        let typeMoves = pokemonTypes.map(type => 
          pokemonData.moves
            .map(move => movesMap.get(move.move.name))
            .filter(move => move && move.type === type)
            .sort((a, b) => b.power - a.power)
            .slice(0, 2)
        ).flat();

        if (pokemonTypes.length === 1) {
          let otherMoves = pokemonData.moves
            .map(move => movesMap.get(move.move.name))
            .filter(move => move && !pokemonTypes.includes(move.type))
            .sort((a, b) => b.power - a.power)
            .slice(0, 2);

          movesDetails = [...typeMoves, ...otherMoves];
        } else {
          movesDetails = typeMoves;
        }
      } else {
        // Random moves if less than 4 available
        for (let j = 0; j < 4; j++) {
          const randomIndex = Math.floor(Math.random() * allMoves.length);
          movesDetails.push({
            _id: allMoves[randomIndex]._id,
            name: allMoves[randomIndex].name
          });
        }
      }

      let selectedMoveIds = movesDetails.map(move => move ? move._id : null).filter(id => id !== null);


      const calcStat = (base, isHP = false) => {
        const IV = 15;
        const EV = 0;
        return isHP
          ? Math.floor(((2 * base + IV + (EV / 4)) * 50) / 100) + 50 + 10
          : Math.floor(((2 * base + IV + (EV / 4)) * 50) / 100) + 5;
      };

      const pokemon = new Pokemon({
        pokedexId: pokemonData.id,
        name: pokemonData.name,
        stats: {
          life: calcStat(pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat, true),
          attack: calcStat(pokemonData.stats.find(stat => stat.stat.name === 'attack').base_stat),
          defense: calcStat(pokemonData.stats.find(stat => stat.stat.name === 'defense').base_stat),
          specialAttack: calcStat(pokemonData.stats.find(stat => stat.stat.name === 'special-attack').base_stat),
          specialDefense: calcStat(pokemonData.stats.find(stat => stat.stat.name === 'special-defense').base_stat),
          speed: calcStat(pokemonData.stats.find(stat => stat.stat.name === 'speed').base_stat)
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
