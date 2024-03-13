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
    logger.error('User not found.');
  } else if (!pokemon) {
    logger.error('Pokemon not found');
  }

  logger.info(user);

  const pokemonPrice = calculatePokemonPrice(pokemon);

  if (user.coins < pokemonPrice) {
    logger.error('Insufficient coins.');
  }

  if (user.team.length >= 6) {
    // TODO el usuario debe elegir que Pokemon eliminar
    logger.error('Team is full. Please remove a Pokémon before buying a new one.');
  }

  user.coins -= pokemonPrice;
  user.team.push(pokemonName);

  await user.save();
  return pokemon;
};

export default buyPokemon;
