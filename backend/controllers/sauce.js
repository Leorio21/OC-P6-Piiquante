const Sauce = require('../models/sauce');
const fs = require('fs/promises');

exports.getAllSauces = async (req, res, next) => {
    await Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

exports.getOneSauce = async (req, res, next) => {
    await Sauce.findOne({ _id: req.params.id})
        .then(sauce => {res.status(200).json(sauce)})
        .catch(error => res.status(400).json({ error }))
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}))
};

exports.likeSauce = async (req, res, next) => {
    switch(req.body.like) {
        case 0:
            await Sauce.findOne({_id: req.params.id,})
            .then(async sauce => {
                if(sauce.usersLiked.includes(req.body.userId)) {
                    await Sauce.findOneAndUpdate(
                        {_id: req.params.id},
                        {
                            $inc: {likes: -1},
                            $pull: {usersLiked: req.body.userId}
                        })
                        .then(() => res.status(201).json({message: 'Vote annulé !'}))
                        .catch(error => res.status(400).json({ error }))
                }
                if(sauce.usersDisliked.includes(req.body.userId)) {
                    await Sauce.findOneAndUpdate(
                        {_id: req.params.id},
                        {
                            $inc: {dislikes: -1},
                            $pull: {usersDisliked: req.body.userId}
                        })
                        .then(() => res.status(201).json({message: 'Vote annulé !'}))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
            break;

    case 1:
        await Sauce.findOneAndUpdate(
            {_id: req.params.id},
            {
                $inc: {likes: 1},
                $push: {usersLiked: req.body.userId}
            })
            .then(() => res.status(201).json({message: 'Vote enregistré !'}))
            .catch(error => res.status(400).json({ error }))
            break;

    case -1:
        await Sauce.findOneAndUpdate(
            {_id: req.params.id},
            {
                $inc: {dislikes: 1},
                $push: {usersDisliked: req.body.userId}
            })
            .then(() => res.status(201).json({message: 'Vote enregistré !'}))
            .catch(error => res.status(400).json({ error }))
            break;

    default:
        console.log("error");
    }
}

exports.modifySauce = async (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = async (req, res, next) => {
    await Sauce.findOne({ _id: req.params.id })
    .then(async sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        try {
            await fs.unlink(`images/${filename}`)
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        } catch (error) {
            console.log("error");
        }
    })
    .catch(error => res.status(500).json({ error }));
};