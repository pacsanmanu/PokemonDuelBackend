import User from '../models/user.js';
import Pokemon from '../models/pokemon.js';
import { getPokemonByName } from './mongodb/pokemon-db-service.js';
import logger from '../utils/logger.js';

function calculatePokemonPrice(pokemon) {
  const totalStats = pokemon.stats.life
                     + pokemon.stats.attack
                     + pokemon.stats.defense
                     + pokemon.stats.specialAttack
                     + pokemon.stats.specialDefense
                     + pokemon.stats.speed;

  logger.info(`Calculating price for ${pokemon.name} with total stats ${totalStats}`);

  let price = 5;

  if (totalStats <= 330) price = 5;
  else if (totalStats <= 390) price = 7;
  else if (totalStats <= 450) price = 10;
  else if (totalStats <= 510) price = 12;
  else if (totalStats <= 555) price = 15;
  else if (totalStats <= 615) price = 18;
  else if (totalStats <= 660) price = 21;
  else if (totalStats <= 720) price = 25;
  else if (totalStats <= 795) price = 28;
  else price = 30;

  return price;
}

export const buyPokemon = async (userId, pokemonName) => {
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

function getGroupIndexByVictories(victories) {
  if (victories <= 2) return [300, 315, 330];
  if (victories <= 6) return [345, 360, 375, 390];
  if (victories <= 10) return [405, 420, 435, 450];
  if (victories <= 14) return [465, 480, 495, 510];
  if (victories <= 17) return [525, 540, 555];
  if (victories <= 21) return [570, 585, 600, 615];
  if (victories <= 24) return [630, 645, 660];
  if (victories <= 28) return [675, 690, 705, 720];
  if (victories <= 33) return [735, 750, 765, 780, 795];
  return [810, 825, 840, 855, 870, 885, 900, 1245];
}

export async function getMarketPokemons(victories) {
  const statsGroups = getGroupIndexByVictories(victories);

  const aggregation = await Pokemon.aggregate([
    {
      $addFields: {
        totalStats: {
          $add: [
            '$stats.life',
            '$stats.attack',
            '$stats.defense',
            '$stats.specialAttack',
            '$stats.specialDefense',
            '$stats.speed',
          ],
        },
      },
    },
    {
      $addFields: {
        statsGroup: {
          $subtract: [
            '$totalStats',
            { $mod: ['$totalStats', 15] },
          ],
        },
      },
    },
    {
      $match: {
        statsGroup: { $in: statsGroups },
      },
    },
    {
      $sample: { size: 3 },
    },
  ]);

  return aggregation;
}
