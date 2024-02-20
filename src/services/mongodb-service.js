import mongoose from 'mongoose';
import moveSchema from '../models/move.js';
import pokemonSchema from '../models/pokemon.js';

const Move = mongoose.model('Move', moveSchema);
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

const getAllPokemons = async () => {
  try {
    const pokemons = await Pokemon.find().populate('moves');
    return pokemons;
  } catch (error) {
    console.error('Error getting all Pokemons', error);
  }
};

const getPokemonByName = async (name) => {
  try {
    const pokemon = await Pokemon.findOne({ name }).populate('moves');
    return pokemon;
  } catch (error) {
    console.error(`Error getting Pokemon by name: ${name}`, error);
  }
};

const getMovesByPokemonName = async (name) => {
  try {
    const pokemon = await Pokemon.findOne({ name }).populate('moves');
    return pokemon ? pokemon.moves : null;
  } catch (error) {
    console.error(`Error getting moves for Pokemon: ${name}`, error);
  }
};

const getPokemonsByNames = async (pokemonNames) => {
  try {
    const pokemons = await Pokemon.find({ name: { $in: pokemonNames } }).populate('moves');
    
    const pokemonsObject = pokemons.reduce((obj, pokemon) => {
      obj[pokemon.name] = pokemon;
      return obj;
    }, {});

    return pokemonsObject;
  } catch (error) {
    console.error('Error getting Pokemons by names', error);
    return {};
  }
};

export { getAllPokemons, getPokemonByName, getPokemonsByNames, getMovesByPokemonName };