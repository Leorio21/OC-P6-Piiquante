const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_KEY_TOKEN);
        const userId = decodedToken.userId;
        req.auth = {userId};
        if (req.body.userId && req.body.userId !== userId) {
            throw 'UserId non valable';
        } else {
            next();
        }
    } catch {
        res.status(401).json({error: error | 'Requête non authentifiée'});
    }
}