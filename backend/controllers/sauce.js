const Sauce = require('../models/sauce');
const fs = require('fs/promises');

exports.getAllSauces = async (req, res, next) => {
    try {
        const sauces = await Sauce.find()
        return res.status(200).json(sauces)
    } catch (error) {
        return res.status(400).json({ error })
    }
};

exports.getOneSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id})
        return res.status(200).json(sauce)
    } catch (error) {
        return res.status(400).json({ error })
    }
};

exports.createSauce = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    try {
        await sauce.save()
        return res.status(201).json({message: 'Sauce enregistrée !'})
    } catch (error) {
        const filename = sauce.imageUrl.split('/images/')[1];
        await fs.unlink(`images/${filename}`)
        return res.status(400).json({error})
    }
};

exports.likeSauce = async (req, res, next) => {
    const likeOptions = [1, 0, -1]
    if(!likeOptions.includes(req.body.like)) {
        return res.status(400).json({ error })
    }
    try {
        const sauce = await Sauce.findOne({_id: req.params.id,})

        if((sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) || (sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1)) {
            return res.status(201).json({message: 'Vote enregistré !'})
        } else if(sauce.usersLiked.includes(req.body.userId) && req.body.like !== 1) {
            await Sauce.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $inc: {likes: -1},
                    $pull: {usersLiked: req.body.userId}
                })
                return res.status(201).json({message: 'Vote annulé !'})
        } else if(sauce.usersDisliked.includes(req.body.userId) && req.body.like !== -1) {
            await Sauce.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked: req.body.userId}
                })
                return res.status(201).json({message: 'Vote annulé !'})
        }

        switch(req.body.like) {
            case 1:
                await Sauce.findOneAndUpdate(
                    {_id: req.params.id},
                    {
                        $inc: {likes: 1},
                        $push: {usersLiked: req.body.userId}
                    })
                    return res.status(201).json({message: 'Vote enregistré !'})

            case -1:
                await Sauce.findOneAndUpdate(
                    {_id: req.params.id},
                    {
                        $inc: {dislikes: 1},
                        $push: {usersDisliked: req.body.userId}
                    })
                    return res.status(201).json({message: 'Vote enregistré !'})
        }
        return res.status(400).json({ error })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

exports.modifySauce = async (req, res, next) => {
    let sauce;
    try {
        sauce = await Sauce.findOne({ _id: req.params.id })
        let sauceObject = {}
        if(req.file) {
            const filename = sauce.imageUrl.split('/images/')[1];
            await fs.unlink(`images/${filename}`)
            sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
        } else {
            sauceObject = { ...req.body };
        }
        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        return res.status(200).json({ message: 'Sauce modifiée !'})
    } catch (error) {
        if (sauce && req.file) {
            const filename = sauce.imageUrl.split('/images/')[1];
            await fs.unlink(`images/${filename}`)
        }
        return res.status(400).json({ error })
    }
};

exports.deleteSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id })
        const filename = sauce.imageUrl.split('/images/')[1];
        await fs.unlink(`images/${filename}`)
        await Sauce.deleteOne({ _id: req.params.id })
        return res.status(200).json({ message: 'Sauce supprimée !'})
    } catch (error) {
        return res.status(400).json({ error })
    }
};