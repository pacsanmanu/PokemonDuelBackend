import User from '../models/user.js';

export default async function removePokemonFromTeam(userId, pokemonIndex) {
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
