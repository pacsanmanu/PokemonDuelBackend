import User from '../models/user.js';
import { getPokemonByName } from './mongodb/pokemon-db-service.js';
import logger from '../utils/logger.js';

function calculatePokemonPrice(pokemon) {
  logger.info(`Calculating price for ${pokemon}`);
  return 5;
}

const buyPokemon = async (userId, pokemonName) => {
  const user = await User.findById(userId);
  const pokemon = await getPokemonByName(pokemonName);

  if (!user) {
    throw new Error('User not found.');
  }
  if (!pokemon) {
    throw new Error('Pokemon not found');
  }
  if (user.coins < calculatePokemonPrice(pokemon)) {
    throw new Error('Insufficient coins.');
  }

  if (user.team.length >= 6) {
    logger.info('Team is full. User must remove a Pokémon before adding a new one.');
    return {
      teamIsFull: true,
      message: 'Team is full. Please remove a Pokémon before buying a new one.',
    };
  }

  user.coins -= calculatePokemonPrice(pokemon);
  user.team.push(pokemonName);
  await user.save();

  return {
    teamIsFull: false,
    pokemon,
  };
};

export default buyPokemon;
