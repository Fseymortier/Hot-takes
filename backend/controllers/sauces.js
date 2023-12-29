const Sauce = require('../model/sauces')
const fs = require('fs')

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({ error: error }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error: error }))
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce) //convert string into object
    delete sauceObject._id
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`, //to add file on request and resolve url to access at images folder
    })
    sauce
        .save()
        .then(() => res.status(201).json({ message: 'Sauce ajouté !' }))
        .catch((error) => res.status(400).json({ error: error }))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file //to verify if a file received
        ? {
              ...JSON.parse(req.body.sauce), // if file received update him
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body } //else update object reveived

    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
        .catch((error) => res.status(400).json({ error: error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1] //return bord with 2 colum to get the name of image
            fs.unlink(`images/${filename}`, () => {
                //use function of package fs to delete image and sauce
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res.status(200).json({ message: 'Sauce supprimé !' })
                    )
                    .catch((error) => res.status(400).json({ error: error }))
            })
        })
        .catch((error) => res.status(400).json({ error: error }))
}

exports.rateSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    //Liker une sauce
    if (like === 1) {
        //On récupère la sauce par son id
        Sauce.updateOne(
            { _id: sauceId },
            {
                //On ajoute l'id de l'utilisateur dans le tableau de ceux ayant liké la sauce et on incrémente le nombre de likes de 1
                $push: { usersLiked: userId },
                $inc: { likes: +1 },
            }
        )
            .then(() => res.status(200).json({ message: 'Sauce likée' }))
            .catch((error) => res.status(400).json({ error }))
    }
    //Disliker une sauce
    if (like === -1) {
        //On récupère la sauce par son id
        Sauce.updateOne(
            { _id: sauceId },
            {
                //On ajoute l'id de l'utilisateur dans le tableau de ceux ayant disliké la sauce et on incrémente le nombre de dislikes de 1
                $push: { usersDisliked: userId },
                $inc: { dislikes: +1 },
            }
        )
            .then(() => res.status(200).json({ message: 'Sauce dislikée' }))
            .catch((error) => res.status(400).json({ error }))
    }

    //Annulation d'un like ou d'un dislike
    //On récupère la sauce avec son id
    if (like === 0) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                //Annulation du like : si  le user a déjà liké la sauce, on le retire du tableau des users ayant liké la sauce et on décrémente le nombre de likes de 1
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $pull: { usersLiked: userId },
                            $inc: { likes: -1 },
                        }
                    )
                        .then(() =>
                            res
                                .status(200)
                                .json({ message: 'Le like a été annulé' })
                        )
                        .catch((error) => res.status(400).json({ error }))
                }

                //Annulation du dislike : si le user a déjà disliké la sauce, on le retire du tableau des users ayant disliké la sauce et on décrémente le nombre de likes de 1
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $pull: { usersDisliked: userId },
                            $inc: { dislikes: -1 },
                        }
                    )
                        .then(() =>
                            res
                                .status(200)
                                .json({ message: 'Le dislike a été annulé' })
                        )
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
    }
}
