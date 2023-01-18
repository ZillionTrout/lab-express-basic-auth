const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');

router.get('/signup', function (req, res, next) {
    res.render('auth/signup');
});

router.post('/signup', async function (req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/signup', { error: 'Username and password required.' });
        return;
    }
try {
    const userInDB = await User.findOne({ username: username });
    if (userInDB) {
        res.render('auth/signup', { error: `There already is a user with username ${username}` });
        return;
    } else {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ username, hashedPassword });
        res.render('/index');
    }
        } catch (error) {
    next(error)
    }
});

module.exports = router;