import Combat from "../services/fight/combatService.js";
import { getPokemonsByNames } from "../services/mongodb/mongodb-pokemon.js";

let combats = {};

export function startCombat(req, res) {
    const { player, ai } = req.body;

    // Asumiendo que getPokemonsByNames es asíncrono y devuelve una promesa
    Promise.all([getPokemonsByNames(player), getPokemonsByNames(ai)])
        .then(([playerPokemons, aiPokemons]) => {
            const combat = new Combat(playerPokemons, aiPokemons);
            const combatId = combat.combatId;
            combats[combatId] = combat;

            // Envía el ID del combate y el mensaje de inicio como respuesta
            res.json({ combatId, message: combat.startCombat() });
        })
        .catch(error => {
            // Manejo de errores, por ejemplo, si no se encuentran los Pokémon
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

export function getStatus(req, res) {
    const { combatId } = req.query;
    const combat = combats[combatId];
    if (!combat) {
      return res.status(404).json({ message: "Combat not found" });
    }
  
    try {
      const combatStatus = combat.combatEnded();
      let message = "";
      if (combatStatus === false) {
        message = "Combat is still ongoing.";
      } else {
        message = combatStatus;
      }
  
      const fullStatus = combat.getCombatStatus();
      res.json({ message, fullStatus });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
