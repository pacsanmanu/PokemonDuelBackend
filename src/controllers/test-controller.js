// Definición de los Pokémon para el combate
const pokemon1 = {
  nombre: "Pikachu",
  ataque: 55,
  defensa: 40,
  velocidad: 90,
  vida: 35,
  nivel: 50,
  movimiento: {
    nombre: "Impactrueno",
    potencia: 40,
    tipo: "Eléctrico",
    efectividad: 1 // Asume efectividad normal por ahora
  }
};

const pokemon2 = {
  nombre: "Charmander",
  ataque: 52,
  defensa: 43,
  velocidad: 65,
  vida: 39,
  nivel: 50,
  movimiento: {
    nombre: "Llamarada",
    potencia: 40,
    tipo: "Fuego",
    efectividad: 1 // Asume efectividad normal por ahora
  }
};

function calcularDaño(pokemonAtacante, pokemonDefensor) {
  const { potencia, efectividad } = pokemonAtacante.movimiento;
  const { ataque } = pokemonAtacante;
  const { defensa } = pokemonDefensor;
  const daño = (((2 * pokemonAtacante.nivel / 5 + 2) * potencia * (ataque / defensa)) / 50 + 2) * efectividad;
  return Math.round(daño);
}

function simularCombate(pokemon1, pokemon2) {
  let turno = 1;

  while (pokemon1.vida > 0 && pokemon2.vida > 0) {
    console.log(`\nTurno ${turno}:`);

    // Determinar el orden basado en la velocidad
    const primero = pokemon1.velocidad > pokemon2.velocidad ? pokemon1 : pokemon2;
    const segundo = primero === pokemon1 ? pokemon2 : pokemon1;

    // Primer ataque
    console.log(`${primero.nombre} ataca a ${segundo.nombre} con ${primero.movimiento.nombre}`);
    let daño = calcularDaño(primero, segundo);
    segundo.vida -= daño;
    segundo.vida = Math.max(0, segundo.vida); // Asegurar que la vida no sea negativa
    console.log(`${segundo.nombre} recibe ${daño} puntos de daño, le quedan ${segundo.vida} puntos de vida`);

    if (segundo.vida <= 0) {
      console.log(`\n${segundo.nombre} se ha debilitado. ¡${primero.nombre} gana el combate!`);
      break;
    }

    // Segundo ataque
    console.log(`${segundo.nombre} ataca a ${primero.nombre} con ${segundo.movimiento.nombre}`);
    daño = calcularDaño(segundo, primero);
    primero.vida -= daño;
    primero.vida = Math.max(0, primero.vida); // Asegurar que la vida no sea negativa
    console.log(`${primero.nombre} recibe ${daño} puntos de daño, le quedan ${primero.vida} puntos de vida`);

    if (primero.vida <= 0) {
      console.log(`\n${primero.nombre} se ha debilitado. ¡${segundo.nombre} gana el combate!`);
      break;
    }

    turno++;
  }
}

// Asegúrate de que las estadísticas de vida de los Pokémon se restablecen antes de iniciar un nuevo combate
pokemon1.vida = 35; // Restablecer la vida de Pikachu
pokemon2.vida = 39; // Restablecer la vida de Charmander

// Ejecutar la simulación del combate
export default simularCombate(pokemon1, pokemon2);
