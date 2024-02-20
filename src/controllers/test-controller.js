import { getPokemonsByNames } from '../services/mongodb-service.js';
import Combat from '../services/fight/combatService.js';

const equipoUser = ['charizard', 'blastoise', 'jolteon', 'mewtwo', 'articuno', 'dragonite'];
const equipoIA = ['venusaur', 'pikachu', 'flareon', 'zapdos', 'moltres', 'aerodactyl'];

 const fetchTeams = async () => {
  try {
    const userTeam = await getPokemonsByNames(equipoUser);
		console.log(userTeam);
    const aiTeam = await getPokemonsByNames(equipoIA);
		console.log(aiTeam);

    const combatInstance = new Combat(userTeam, aiTeam);
    combatInstance.startCombat();
  } catch (error) {
    console.error('Error fetching Pokémon teams:', error);
  }
};

export default fetchTeams;