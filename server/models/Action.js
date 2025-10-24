const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Recycled','PublicTransport','AvoidedPlastic','PlantedTree'], required: true },
  points: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Action', actionSchema);
