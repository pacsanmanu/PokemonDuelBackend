import {
  getAllPokemons, getPokemonByName, getPokemonsByNames,
} from '../services/mongodb/pokemon-db-service.js';

export async function getAllPokemonsController(req, res, next) {
  try {
    const pokemons = await getAllPokemons();
    res.status(200).send(pokemons);
  } catch (error) {
    next(error);
  }
}

export async function getPokemonByNameController(req, res, next) {
  try {
    const { name } = req.body;
    const pokemon = await getPokemonByName(name);
    res.status(200).send(pokemon);
  } catch (error) {
    next(error);
  }
}

export async function getPokemonsByNamesController(req, res, next) {
  try {
    const { names } = req.body;
    const pokemons = await getPokemonsByNames(names);
    res.status(200).send(pokemons);
  } catch (error) {
    next(error);
  }
}

export async function getStarterPokemonsController(req, res, next) {
  try {
    const starterNames = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'treecko', 'torchic', 'mudkip', 'chimchar', 'piplup', 'turtwig', 'snivy', 'tepig', 'oshawott', 'chespin', 'fennekin', 'froakie', 'rowlet', 'litten', 'popplio', 'grookey', 'scorbunny', 'sobble', 'sprigatito', 'fuecoco', 'quaxly'];
    const starters = await getPokemonsByNames(starterNames);
    res.status(200).send(starters);
  } catch (error) {
    next(error);
  }
}
