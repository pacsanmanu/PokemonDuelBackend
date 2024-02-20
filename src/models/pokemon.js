import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stats: {
    life: Number,
    attack: Number,
    defense: Number,
    specialAttack: Number,
    specialDefense: Number,
    speed: Number
  },
  types: [String],
  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Move' }]
});

export default mongoose.model('Pokemon', pokemonSchema);
