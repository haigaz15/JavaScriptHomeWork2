const User = require('../users/user.entity');
const { Unauthorized } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../auth/auth.service');

class adminService {
    async unlock(id) {
        //User.findByIdAndUpdate(id, { isLocked: true, counter: 0 }, { useFindAndModify: false })
        const user = await User.findById(id);
        user.isLocked = false;
        user.counter = 0;
        await user.save();
    }
    async lock(id) {
        const user = await User.findById(id);
        user.isLocked = true;
        await user.save();
    }
}
module.exports = new adminService();