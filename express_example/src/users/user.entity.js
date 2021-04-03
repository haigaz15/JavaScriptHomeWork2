const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ADMIN_ROLE, CUSTOMER_ROLE } = require('../commons/util');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        minLength: 4,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        trim: true,
        required: true,
    },

    lastName: {
        type: String,
        trim: true,
        required: true,
    },

    role: {
        type: String,
        enum: [ADMIN_ROLE, CUSTOMER_ROLE],
        default: CUSTOMER_ROLE,
    },
    isLocked: {
        type: Boolean,
        default: false,
    },
    counter: {
        type: Number,
        default: 0,
    }
}, { collection: 'users' });

schema.pre('save', function(next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync();
        this.password = bcrypt.hashSync(this.password, salt);
    }

    next();
})

module.exports = mongoose.model('User', schema);