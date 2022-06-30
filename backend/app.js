const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const mongoDbUser = process.env.MONGODB_USER;
const mongoDbPassword = process.env.MONGODB_PASSWORD;
const mongoDbCluster = process.env.MONGODB_CLUSTER;

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

mongoose.connect(`mongodb+srv://${mongoDbUser}:${mongoDbPassword}@${mongoDbCluster}/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussi !'))
    .catch(() => console.log('Connexion à MongoDB échoué !'));

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(mongoSanitize({
    allowDots: true,
    replaceWith: '_'
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);

app.use('/api/sauces', sauceRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;