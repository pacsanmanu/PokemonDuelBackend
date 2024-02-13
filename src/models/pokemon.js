import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stats: {
    atk: Number,
    def: Number,
    atkEspecial: Number,
    defEspecial: Number,
    velocidad: Number,
    vida: Number
  },
  types: [String],
  movements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Move' }]
});

export default mongoose.model('Pokemon', pokemonSchema);
