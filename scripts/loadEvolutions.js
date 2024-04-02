/* eslint-disable no-await-in-loop */
import mongoose from 'mongoose';
import config from '../src/config.js';
import connectDatabase from '../src/loaders/mongodb-loader.js';
import Pokemon from '../src/models/pokemon.js';
import logger from '../src/utils/logger.js';

const pokemonExistsInDatabase = async (pokemonName) => {
  try {
    const pokemon = await Pokemon.findOne({ name: pokemonName });
    return !!pokemon;
  } catch (error) {
    logger.error(`Error verifying if Pokemon exists in database: ${pokemonName}`, error);
    return false;
  }
};

async function fetchEvolutions(pokemonName) {
  try {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();

    let currentStage = evolutionData.chain;

    while (currentStage && currentStage.species.name !== pokemonName) {
      if (currentStage.evolves_to.length > 0) {
        [currentStage] = currentStage.evolves_to;
      } else {
        return '';
      }
    }

    if (currentStage && currentStage.evolves_to.length > 0) {
      const nextEvolution = currentStage.evolves_to[0].species.name;
      if (await pokemonExistsInDatabase(nextEvolution)) {
        return nextEvolution;
      }
      return '';
    }
    return '';
  } catch (error) {
    logger.error('There was an error fetching the evolutions:', error);
    return '';
  }
}

async function updatePokemonEvolutions() {
  try {
    await connectDatabase(config.database);
    logger.info('Connected to database, updating evolutions...');

    const pokemons = await Pokemon.find({});

    // eslint-disable-next-line no-restricted-syntax
    for (const pokemon of pokemons) {
      const evolution = await fetchEvolutions(pokemon.name);
      if (evolution && await pokemonExistsInDatabase(evolution)) {
        await Pokemon.updateOne({ _id: pokemon._id }, { $set: { evolution } });
        logger.info(`Updated evolution for ${pokemon.name} to ${evolution}`);
      } else {
        logger.info(`No evolution found or evolution not in database for ${pokemon.name}`);
      }
    }

    logger.info('Finished updating Pokémon evolutions.');
  } catch (error) {
    logger.error('Error updating Pokémon evolutions:', error);
  } finally {
    mongoose.connection.close();
  }
}

updatePokemonEvolutions();
