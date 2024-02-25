import Combat from '../services/fight/combatService.js';
import { getPokemonsByNames } from '../services/mongodb/mongodb-pokemon.js';
let combats = {};


export const startCombat = async (req, res) => {
    const { userTeamNames, aiTeamNames } = req.body;

    try {
        const userPokemons = await getPokemonsByNames(userTeamNames);
        const aiPokemons = await getPokemonsByNames(aiTeamNames);

        const combat = new Combat(userPokemons, aiPokemons);

        const initialState = combat.startCombat();

        const combatId = Date.now().toString();
        combats[combatId] = combat;

        res.json({
            message: "Combate iniciado correctamente",
            combatId,
            initialState
        });
    } catch (error) {
        console.error('Error al iniciar el combate:', error);
        res.status(500).json({ message: "Error interno al iniciar el combate." });
    }
};

export const performAttack = async (req, res) => {
	const { combatId, moveIndex } = req.body;
	
	const combat = combats[combatId];
	if (!combat) {
			return res.status(404).json({ message: "Combate no encontrado." });
	}

	try {
			const attackResult = combat.attack(moveIndex);
			
			res.json({
					message: "Ataque realizado con éxito.",
					attackResult
			});
	} catch (error) {
			console.error('Error al realizar el ataque:', error);
			res.status(500).json({ message: "Error interno al realizar el ataque." });
	}
};

export const changePokemon = async (req, res) => {
    const { combatId, pokemonIndex } = req.body;

    const combat = combats[combatId];
    if (!combat) {
        return res.status(404).json({ message: "Combate no encontrado." });
    }

    try {
        const changeResult = combat.change(pokemonIndex);
        res.json({
            message: "Cambio de Pokémon realizado con éxito.",
            changeResult
        });
    } catch (error) {
        console.error('Error al cambiar el Pokémon:', error);
        res.status(500).json({ message: "Error interno al cambiar el Pokémon." });
    }
};

export const listAvailableMoves = (req, res) => {
    const { combatId } = req.query;

    const combat = combats[combatId];
    if (!combat) {
        return res.status(404).json({ message: "Combate no encontrado." });
    }

    try {
        const availableMoves = combat.listMoves();

        res.json({
            message: "Movimientos disponibles listados con éxito.",
            availableMoves
        });
    } catch (error) {
        console.error('Error al listar los movimientos disponibles:', error);
        res.status(500).json({ message: "Error interno al listar los movimientos disponibles." });
    }
};

export const listAvailablePokemons = (req, res) => {
    const { combatId } = req.query;

    const combat = combats[combatId];
    if (!combat) {
        return res.status(404).json({ message: "Combate no encontrado." });
    }

    try {
        const availablePokemons = combat.listPokemonsForChange();

        res.json({
            message: "Pokémon disponibles listados con éxito.",
            availablePokemons
        });
    } catch (error) {
        console.error('Error al listar los Pokémon disponibles:', error);
        res.status(500).json({ message: "Error interno al listar los Pokémon disponibles." });
    }
};
