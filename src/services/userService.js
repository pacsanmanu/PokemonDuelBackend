import User from '../models/user.js';
import { calculatePokemonPrice } from './marketService.js';
import { getPokemonByName } from './mongodb/pokemon-db-service.js';
import logger from '../utils/logger.js';

export default async function sellPokemon(userId, pokemonIndex) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (pokemonIndex < 0 || pokemonIndex >= user.team.length) {
    throw new Error('Invalid Pokemon index');
  }

  if (user.team.length <= 1) {
    throw new Error('Cannot sell Pokémon as it would leave your team empty');
  }

  const [removedPokemonName] = user.team.splice(pokemonIndex, 1);

  const pokemon = await getPokemonByName(removedPokemonName);

  if (!pokemon) {
    throw new Error('Failed to fetch Pokémon details');
  }

  const price = calculatePokemonPrice(pokemon);

  logger.info(`User ${user.username} sold ${pokemon.name} for ${price} coins`);

  user.coins += price;

  await user.save();

  return user.team;
}
