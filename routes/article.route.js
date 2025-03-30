var express = require('express');
var router = express.Router();
const Article = require('../models/article');
const {verifyToken} =require("../middleware/verifytocken");
const { uploadFile } = require('../middleware/uplooadfile');
const {authorizeRoles} = require("../middleware/authorizeRoles");
// afficher la liste des articles.

router.get('/',verifyToken,authorizeRoles("user","admin","visiteur"),async (req, res, )=> {
    try {
    const articles = await Article.find({}, null, {sort: {'_id': -1}}).populate("scategorieID").exec();
    res.status(200).json(articles);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
// créer un nouvel article
router.post('/',verifyToken, async (req, res) => {
    const nouvarticle = new Article(req.body)
    try {
    const response =await nouvarticle.save();
    
    res.status(200).json(response);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
// chercher un article
router.get('/:articleId',async(req, res)=>{
    try {
    const art = await Article.findById(req.params.articleId);
    res.status(200).json(art);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });

// modifier une catégorie
router.put('/:articleId',verifyToken, async (req, res) => {
    try {
        const art = await Article.findByIdAndUpdate(
        req.params.articleId,
        { $set: req.body },
        { new: true }
        );
        const articles = await
        Article.findById(art._id).populate("scategorieID").exec();
        res.status(200).json(articles);
        } catch (error) {
        res.status(404).json({ message: error.message });
        }
});

// Supprimer une catégorie
router.delete('/:articleId',verifyToken, async (req, res) => {
    const id = req.params.articleId;
    try {
    await Article.findByIdAndDelete(id);
    res.status(200).json({ message: "article deleted successfully." });
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
});

// chercher un article par s/cat
router.get('/scat/:scategorieID',async(req, res)=>{
    try {
    const art = await Article.find({ scategorieID:
    req.params.scategorieID}).exec();
    res.status(200).json(art);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
module.exports = router;