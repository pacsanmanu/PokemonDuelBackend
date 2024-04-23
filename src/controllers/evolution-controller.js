import { evolvePokemon, calculateEvolutionCost } from '../services/evolutionService.js';

export async function evolvePokemonController(req, res, next) {
  try {
    const { userId, pokemonIndex } = req.body;
    const evolvedPokemon = await evolvePokemon(userId, pokemonIndex);
    res.status(200).send({ message: 'Pokemon evolved successfully.', evolvedPokemon });
  } catch (error) {
    next(error);
  }
}

// eslint-disable-next-line consistent-return
export async function getEvolutionPriceController(req, res, next) {
  try {
    const { pokemonName } = req.body;

    if (!pokemonName) {
      return res.status(404).send({ message: 'Pokemon not found.' });
    }
    const evolutionCost = await calculateEvolutionCost(pokemonName);
    res.status(200).send({ evolutionCost });
  } catch (error) {
    next(error);
  }
}
