const User = require('../users/user.entity');
const { Unauthorized } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async validate(username, password) {
        const user = await User.findOne({ username });
        if (user && user.isLocked) {
            throw new Error('The user is locked!');
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            if (user) {
                const attemptcount = user.counter + 1;
                user.counter = attemptcount;
                if (user.counter >= 3) {
                    user.isLocked = true;
                }
                await user.save();
                if (user.isLocked) {
                    throw new Error('The user is locked!');
                }
            }
            throw new Unauthorized();
        }
        if (user.counter < 3) {
            user.counter = 0;
            await user.save();
        }
        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }
}

module.exports = new AuthService();