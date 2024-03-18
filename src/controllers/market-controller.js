// buyPokemonController.js
import logger from '../utils/logger.js';
import { buyPokemon, getMarketPokemons } from '../services/marketService.js';

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

export const getMarketPokemonsController = async (req, res) => {
  try {
    const { victories } = req.body;
    const pokemons = await getMarketPokemons(victories);

    res.json({
      message: 'Pokemons fetched successfully',
      pokemons,
    });
  } catch (error) {
    logger.error('Failed to fetch pokemons:', error);
    res.status(500).send({ message: 'Error fetching pokemons' });
  }
};
