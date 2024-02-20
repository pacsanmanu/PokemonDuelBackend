import mongoose from 'mongoose';
import Move from '../models/move.js';
import Pokemon from '../models/pokemon.js';

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
    return pokemons; // Directamente retorna el array de documentos
  } catch (error) {
    console.error('Error getting Pokemons by names', error);
    return []; // Retorna un array vacío en caso de error
  }
};

export { getAllPokemons, getPokemonByName, getPokemonsByNames, getMovesByPokemonName };