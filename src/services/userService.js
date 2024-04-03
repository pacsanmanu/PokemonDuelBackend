import User from '../models/user.js';
import { getPokemonByName } from './mongodb/pokemon-db-service.js';

async function removePokemonFromTeam(userId, pokemonIndex) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (pokemonIndex < 0 || pokemonIndex >= user.team.length) {
    throw new Error('Invalid Pokemon index');
  }

  user.team.splice(pokemonIndex, 1);
  await user.save();

  return user.team;
}

async function evolvePokemon(userId, pokemonIndex) {
  const user = await User.findById(userId);
  const pokemon = await getPokemonByName(user.team[pokemonIndex]);
  const evolvedPokemon = await getPokemonByName(pokemon.evolution);
  user.team[pokemonIndex] = evolvedPokemon.name;
  await user.save();
  return evolvedPokemon.name;
}

export { removePokemonFromTeam, evolvePokemon };
