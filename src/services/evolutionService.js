import User from '../models/user.js';
import { getPokemonByName } from './mongodb/pokemon-db-service.js';

async function calculateEvolutionCost(pokemonName) {
  const pokemon = await getPokemonByName(pokemonName);
  const totalStats = pokemon.stats.life
                     + pokemon.stats.attack
                     + pokemon.stats.defense
                     + pokemon.stats.specialAttack
                     + pokemon.stats.specialDefense
                     + pokemon.stats.speed;

  if (totalStats <= 500) {
    return 10;
  } if (totalStats <= 650) {
    return 20;
  }
  return 30;
}

async function evolvePokemon(userId, pokemonIndex) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found.');

  const pokemon = await getPokemonByName(user.team[pokemonIndex]);
  if (!pokemon) throw new Error('Pokemon not found.');

  const evolvedPokemon = await getPokemonByName(pokemon.evolution);
  if (!evolvedPokemon) throw new Error('Evolved Pokemon not found.');

  const evolutionCost = await calculateEvolutionCost(evolvedPokemon.name);

  if (user.coins < evolutionCost) {
    throw new Error('Insufficient coins for evolution.');
  }

  user.coins -= evolutionCost;
  user.team[pokemonIndex] = evolvedPokemon.name;
  await user.save();

  return evolvedPokemon.name;
}

export { calculateEvolutionCost, evolvePokemon };
