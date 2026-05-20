const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  level: String,
  marks: Number,
  income: Number,
  category: String,
  state: String,
  field: String,
  sports: Boolean,
  status: String,
  matchedScholarships: Array,
  reasons: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
