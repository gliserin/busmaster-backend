const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  route: {
    type: String,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("bus", BusSchema);
