'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Importer le type email
require('mongoose-type-email');


const userSchema = new Schema(
    {

        email: {
           type: [mongoose.SchemaTypes.Email,"Veuillez entrer un courriel valide"],
           required: [true, "Veuillez entrer un courriel"]
        },
        username: {
            type: String,
            required: [true, "Veuillez entrer un nom d'utilisateur"],
            minlength: [3, "Le nom d'utilisateur doit contenir 3 caratères au minimum "]
        },
        password: {
            type: String,
            required: [true, "Veuillez entrer un mot de passe"],
            minlength: [5, "Le mot de passe doit contenir 5 caractères au minimum "]
        },
        salt:{
            type:String,
            required:true
        },
        verified:{
            type : Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);