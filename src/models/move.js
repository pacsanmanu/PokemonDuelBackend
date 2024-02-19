import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
  name: { type: String, required: true },
  PP: { type: Number, required: true },
  power: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true }
});

export default mongoose.model('Move', moveSchema);
