/* eslint-disable consistent-return */
import Pokemon from '../../models/pokemon.js';
// eslint-disable-next-line no-unused-vars
import Move from '../../models/move.js';
import logger from '../../utils/logger.js';

const getAllPokemons = async () => {
  try {
    const pokemons = await Pokemon.find().populate('moves');
    return pokemons;
  } catch (error) {
    logger.error('Error getting all Pokemons', error);
  }
};

const getPokemonByName = async (name) => {
  try {
    const pokemon = await Pokemon.findOne({ name }).populate('moves');
    return pokemon;
  } catch (error) {
    logger.error(`Error getting Pokemon by name: ${name}`, error);
  }
};

const getMovesByPokemonName = async (name) => {
  try {
    const pokemon = await Pokemon.findOne({ name }).populate('moves');
    return pokemon ? pokemon.moves : null;
  } catch (error) {
    logger.error(`Error getting moves for Pokemon: ${name}`, error);
  }
};

const getPokemonsByNames = async (pokemonNames) => {
  try {
    const uniquePokemons = await Pokemon.find({ name: { $in: [...new Set(pokemonNames)] } }).populate('moves');
    const pokemonsRepeated = pokemonNames.map((pokemonName) => uniquePokemons.find((pokemon) => pokemon.name === pokemonName)).filter((pokemon) => pokemon !== undefined);
    return pokemonsRepeated;
  } catch (error) {
    logger.error('Error getting Pokemons by names', error);
    return [];
  }
};

export {
  getAllPokemons, getPokemonByName, getPokemonsByNames, getMovesByPokemonName,
};
