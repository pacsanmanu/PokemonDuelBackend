import Combat from "../services/fight/combatService.js";
import { getPokemonsByNames } from "../services/mongodb/pokemon-db-service.js";

let combats = {};

export function startCombat(req, res) {
    const { player, ai } = req.body;

    Promise.all([getPokemonsByNames(player), getPokemonsByNames(ai)])
        .then(([playerPokemons, aiPokemons]) => {
            const combat = new Combat(playerPokemons, aiPokemons);
            const combatId = combat.combatId;
            combats[combatId] = combat;

            res.json({ combatId, playerPokemons, aiPokemons, message: combat.startCombat() });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}

export function executeAttack(req, res) {
    const { combatId, moveIndex } = req.body;
    const combat = combats[combatId];
    if (!combat) {
        return res.status(404).json({ message: "Combat not found" });
    }

    try {
        const result = combat.executeAttack(moveIndex);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export function changePokemon(req, res) {
    const { combatId, pokemonName, forcedChange = false } = req.body;
    const combat = combats[combatId];
    if (!combat) {
        return res.status(404).json({ message: "Combat not found" });
    }

    try {
        const result = combat.changePokemon(pokemonName, forcedChange);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export function deleteCombat(req, res) {
    const { combatId } = req.body;
    delete combats[combatId];
    res.json({ message: "Combat deleted" });
}