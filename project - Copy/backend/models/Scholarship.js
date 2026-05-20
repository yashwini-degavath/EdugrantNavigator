const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: String,
  minMarks: Number,
  maxIncome: Number,
  category: String,
  level: String,
  gender: String,
  minAge: Number,
  maxAge: Number,
  state: String,
  field: mongoose.Schema.Types.Mixed,
  sports: Boolean,
  deadline: String,
  applyLink: String
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
