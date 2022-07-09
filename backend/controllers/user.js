const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    try {
        hash = await bcrypt.hash(req.body.password, 12);
        const user = new User({
            email: req.body.email,
            password: hash
        });
        await user.save();
        return res.status(201).json({message: 'User enregistré !'});
    } catch (error) {
        return res.status(400).json(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        if (!user) {
            return res.status(403).json({message: "Nom d'utilisateur / Mot de passe incorrect"});
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
            if(!valid) {
                return res.status(403).json({message: "Nom d'utilisateur / Mot de passe incorrect"});
            }
            return res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id},
                    process.env.RANDOM_KEY_TOKEN,
                    { expiresIn : '24h'}
                )
            });
        } catch (error) {
            return res.status(500).json(error);
        }
}
