const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors')

mongoose.plugin(mongodbErrorHandler);

const sauceSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, required: true},
    dislikes: {type: Number, required: true},
    usersLiked: [String],
    usersDisliked: [String]
});

sauceSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Sauce', sauceSchema);