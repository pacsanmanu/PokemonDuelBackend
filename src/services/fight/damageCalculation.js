import calculateEffectiveness from './typeEffectiveness.js';

export default function calculateDamage(attacker, defender, move) {
  const power = move.power;
  const isSpecialMove = move.category === 'Special';
  const attack = isSpecialMove ? attacker.stats.specialAttack : attacker.stats.attack;
  const defense = isSpecialMove ? defender.stats.specialDefense : defender.stats.defense;
  const STAB = attacker.types.includes(move.type) ? 1.5 : 1;
  console.log(move.type)
  console.log(defender.types)
  const effectiveness = calculateEffectiveness(move.type, defender.types);

  const modifier = STAB * effectiveness;
  const damage = Math.floor(((2 * 50 / 5 + 2) * power * (attack / defense) / 50 + 2) * modifier);

  return damage;
}
