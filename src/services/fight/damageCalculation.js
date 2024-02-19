import calculateEffectiveness from './typeEffectiveness.js';

export default function calculateDamage(attacker, move, defender) {
  const power = move.power;
  const isSpecialMove = move.category === 'Special';
  const attack = isSpecialMove ? attacker.specialAttack : attacker.attack;
  const defense = isSpecialMove ? defender.specialDefense : defender.defense;
  const STAB = attacker.types.includes(move.type) ? 1.5 : 1;
  const effectiveness = calculateEffectiveness(move.type, defender.types);

  const modifier = STAB * effectiveness;
  const damage = Math.floor(((2 * 50 / 5 + 2) * power * (attack / defense) / 50 + 2) * modifier);

  return damage;
}
