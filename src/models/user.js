import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  victories: { type: Number, default: 0 },
  longestWinStreak: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  team: [{ type: String }],
});

export default mongoose.model('User', userSchema);
