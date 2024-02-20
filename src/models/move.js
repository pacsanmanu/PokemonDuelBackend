import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  PP: { type: Number, default: 5 },
  power: { type: Number, required: true },
  accuracy: { type: Number, default: 100},
  type: { type: String, required: true },
  category: { type: String, required: true }
});

export default mongoose.model('Move', moveSchema);
