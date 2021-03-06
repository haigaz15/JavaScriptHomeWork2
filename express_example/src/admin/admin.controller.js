const express = require('express');
const router = express.Router();
const admin = require('./admin.service');
const User = require('../users/user.entity');
const asyncHandler = require('express-async-handler');
const { ADMIN_ROLE } = require('../commons/util');
const adminService = require('./admin.service');




router.patch('/unlock-user/:id', asyncHandler(async(req, res) => {
    const { id } = req.params;
    if (req.user.role != ADMIN_ROLE) {
        throw new Error('Not authorized!')
    }
    const result = await admin.unlock(id)
    res.status(200).send({ message: 'User has successfully been unlocked!' });
}))

router.patch('/lock-user/:id', asyncHandler(async(req, res) => {
    const { id } = req.params;
    if (req.user.role != ADMIN_ROLE) {
        throw new Error('Not authorized!');
    }
    const result = await admin.lock(id)
    res.status(200).send({ message: 'User has successfully been locked!' });
}))


module.exports = router;