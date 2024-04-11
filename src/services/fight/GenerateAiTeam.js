import User from '../../models/user.js';
import Pokemon from '../../models/pokemon.js';
import logger from '../../utils/logger.js';

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

const generateAiTeam = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const statsGroups = getGroupIndexByVictories(user.victories);

    const aggregationPipeline = [
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
        $sample: { size: user.team.length },
      },
      {
        $project: { _id: 0, name: 1 },
      },
    ];

    const similarPokemons = await Pokemon.aggregate(aggregationPipeline);

    return similarPokemons.map((pokemon) => pokemon.name);
  } catch (error) {
    logger.error('Error generating AI team', error);
    return [];
  }
};

export default generateAiTeam;
