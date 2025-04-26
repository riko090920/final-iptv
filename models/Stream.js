const mongoose = require('mongoose');

const StreamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  logo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stream', StreamSchema);
