'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Importer le type email
require('mongoose-type-email');

const userSchema = new Schema(
    {

        email: mongoose.SchemaTypes.Email,
        username: {
            type: String,
            required: true,
            minlength: 3
        },
        password: String

    }
);

module.exports = mongoose.model('User', userSchema);