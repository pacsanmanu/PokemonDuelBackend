import calculateEffectiveness from './typeEffectiveness.js';

export default function calculateDamage(attacker, defender, move) {
  const { power } = move;
  const isSpecialMove = move.category === 'Special';
  const attack = isSpecialMove ? attacker.stats.specialAttack : attacker.stats.attack;
  const defense = isSpecialMove ? defender.stats.specialDefense : defender.stats.defense;
  const STAB = attacker.types.includes(move.type) ? 1.5 : 1;
  const effectiveness = calculateEffectiveness(move.type, defender.types);
  const modifier = STAB * effectiveness;
  // eslint-disable-next-line no-mixed-operators
  const damage = Math.floor(((2 * 50 / 5 + 2) * power * (attack / defense) / 50 + 2) * modifier);

  return damage;
}
