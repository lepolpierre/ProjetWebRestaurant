const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const platsSchema = new Schema(
  {
    name: {
      type: String, 
      required: true,
      minlength : [5, "Le nom du repas doit contenir 5 caractères au moins."]
    },
    description: {
      type: String,
      required: false,
      minlength : [10, "La description du repas doit contenir 10 caractères au moins."]
    },
    vege: {
      type: Boolean,
      required: false,
      default: false
    },
    categorie: {
      type: String,
      required: false,
      enum : [ "dessert", "entree" , "plat"]
    },
    prix: {
      type: Number,
      required: false
    }

  }
);

module.exports = mongoose.model('Plat', platsSchema);