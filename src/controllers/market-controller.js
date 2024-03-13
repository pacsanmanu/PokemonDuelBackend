import buyPokemon from '../services/marketService.js';

export async function buyPokemonController(req, res, next) {
  try {
    const { pokemonName } = req.body;
    const userId = req.user.id;

    const pokemon = await buyPokemon(userId, pokemonName);

    res.json({
      message: 'Pokemon bought successfully',
      pokemon,
    });
  } catch (error) {
    next(error);
  }
}

export default buyPokemonController;
