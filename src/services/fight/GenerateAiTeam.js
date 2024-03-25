import User from '../../models/user.js';
import Pokemon from '../../models/pokemon.js';
import { getPokemonsByNames } from '../mongodb/pokemon-db-service.js';
import logger from '../../utils/logger.js';

const getSimilarPokemonsByStats = async (avgStats, teamSize) => {
  try {
    const tolerance = 20;
    const avgTotalStats = Object.values(avgStats).reduce((acc, val) => acc + val, 0);
    logger.info(`Average Total Stats: ${avgTotalStats}`);

    let matchStage;
    if (avgTotalStats > 800) {
      matchStage = {
        $match: {
          $expr: {
            $gte: [
              { $add: ['$stats.life', '$stats.attack', '$stats.defense', '$stats.specialAttack', '$stats.specialDefense', '$stats.speed'] },
              800,
            ],
          },
        },
      };
    } else {
      matchStage = {
        $match: {
          $and: Object.keys(avgStats).map((key) => ({
            [`stats.${key}`]: { $gte: avgStats[key] - tolerance, $lte: avgStats[key] + tolerance },
          })),
        },
      };
    }

    const sampleStage = { $sample: { size: teamSize } };
    const projectStage = { $project: { _id: 0, name: 1 } };

    const aggregationPipeline = [matchStage, sampleStage, projectStage];
    const similarPokemons = await Pokemon.aggregate(aggregationPipeline);

    return similarPokemons.map((pokemon) => pokemon.name);
  } catch (error) {
    logger.error('Error getting similar Pokemons by stats using aggregation', error);
    return [];
  }
};

export default async function generateAiTeam(userId) {
  try {
    const user = await User.findById(userId);
    const userPokemons = await getPokemonsByNames(user.team);

    const avgStats = userPokemons.reduce((acc, pokemon) => {
      Object.keys(pokemon.stats).forEach((key) => {
        if (!acc[key]) acc[key] = 0;
        acc[key] += pokemon.stats[key];
      });
      return acc;
    }, {});

    Object.keys(avgStats).forEach((key) => {
      avgStats[key] /= userPokemons.length;
    });

    const AiTeam = await getSimilarPokemonsByStats(avgStats, user.team.length);

    logger.info(AiTeam);
    return AiTeam;
  } catch (error) {
    logger.error('Error generating AI team', error);
    return [];
  }
}
