const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const platSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },

  },
);

module.exports = mongoose.model('Plat', platSchema);