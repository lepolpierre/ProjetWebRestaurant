const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const platsSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    vegetarien: {
      type: Boolean,
      required: false
    },
    prix: {
      type: Number,
      required: false
    },


  }
);

module.exports = mongoose.model('Plat', platsSchema);