const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pagesSchema = new Schema(
  {
    titre: {
      type: String,
      required: true
    },
    contenu: {
      type: String,
      required: true
    }
  }
);

module.exports = mongoose.model('Page', pagesSchema);