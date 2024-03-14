// buyPokemonController.js
import buyPokemon from '../services/marketService.js';

export async function buyPokemonController(req, res, next) {
  try {
    const { pokemonName } = req.body;
    const userId = req.user.id;

    const result = await buyPokemon(userId, pokemonName);

    if (result.teamIsFull) {
      res.json({
        teamIsFull: true,
        message: result.message,
      });
    }

    res.json({
      message: 'Pokemon bought successfully',
      pokemon: result.pokemon,
    });
  } catch (error) {
    next(error);
  }
}

export default buyPokemonController;
