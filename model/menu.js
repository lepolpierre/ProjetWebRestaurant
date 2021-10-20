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
    vege: {
      type: Boolean,
      required: false
    },
    categorie: {
      type: String,
      required: false
    },
    prix: {
      type: Number,
      required: false
    },

  }
);

module.exports = mongoose.model('Plat', platsSchema);