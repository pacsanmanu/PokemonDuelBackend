import mongoose from 'mongoose';
import connectDatabase from '../src/loaders/mongodb-loader.js';
import config from '../src/config.js';
import Move from '../src/models/move.js';

function formatMoveName(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function fetchAndStoreMoves() {
  try {
    await connectDatabase(config.database);
    await Move.deleteMany({});

    let hasNextPage = true;
    let url = 'https://pokeapi.co/api/v2/move?limit=100';

    while (hasNextPage) {
      const response = await fetch(url);
      const data = await response.json();
      const moves = data.results;

      for (const move of moves) {
        const moveDetailsResponse = await fetch(move.url);
        const moveData = await moveDetailsResponse.json();

        if (moveData.power > 30) {
          const formattedName = formatMoveName(moveData.name);
          const newMove = new Move({
            name: formattedName,
            PP: moveData.pp,
            power: moveData.power,
            accuracy: moveData.accuracy,
            type: moveData.type.name,
            category: moveData.damage_class.name,
          });

          await newMove.save();
          console.log(`Move ${formattedName} saved.`);
        }
      }

      if (data.next) {
        url = data.next;
      } else {
        hasNextPage = false;
      }
    }

    console.log('Finished storing moves.');
  } catch (error) {
    console.error('Error fetching or storing moves:', error);
  } finally {
    mongoose.connection.close();
  }
}

fetchAndStoreMoves();