const express = require('express');
const router = express.Router();
const User=require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { uploadFile } = require('../middleware/uplooadfile');
const bodyParser = require('body-parser');
// Create a transporter
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "youremail@gmail.com",
      pass: "your password",
   },tls:{
    rejectUnauthorized:false 
    }
  });
    require('dotenv').config()
// créer un nouvel utilisateur
router.post('/register', async (req, res) => {
    try {
    let { email, password, firstname, lastname } = req.body
    const user = await User.findOne({ email })
    if (user) return res.status(404).send({ success: false, message:"User already exists" })
    
    const newUser = new User({ email, password, firstname, lastname })
    const createdUser = await newUser.save()
    // Envoyer l'e-mail de confirmation de l'inscription
var mailOption ={
    from: '"verify your email " <hazarsayar42@gmail.com>',
    to: newUser.email,
    subject: 'vérification your email ',
    html:`<h2>${newUser.firstname}! thank you for registreting on our website</h2>
    <h4>please verify your email to procced.. </h4>
    <a
    href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">click
    here</a>`
    }
    transporter.sendMail(mailOption,function(error,info){
    if(error){
    console.log(error)
    }
    else{
    console.log('verification email sent to your gmail account ')
    } 
    })
    return res.status(201).send({ success: true, message: "Account created successfully", user: createdUser })
    } catch (err) {
    console.log(err)
    res.status(404).send({ success: false, message: err })
    }
    });
    // afficher la liste des utilisateurs.
router.get('/', async (req, res, )=> {
    try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    
    });
    /**
* as an admin i can disable or enable an account
*/
router.get('/status/edit/', async (req, res) => {
    try {
    let email = req.query.email
    let user = await User.findOne({email})
    user.isActive = !user.isActive
    user.save()
    res.status(200).send({ success: true, user })
    } catch (err) {
    return res.status(404).send({ success: false, message: err })
    }
    })
    // Importation du module router pour gérer les routes
router.post('/login', async (req, res) => {
    try {
        // Récupération des données envoyées dans la requête (email et mot de passe)
        let { email, password } = req.body;

        // Vérification si les champs sont vides
        if (!email || !password) {
            return res.status(404).send({ success: false, message: "All fields are required" });
        }

        // Recherche de l'utilisateur dans la base de données via l'email
        let user = await User.findOne({ email });

        // Vérification si l'utilisateur existe
        if (!user) {
            return res.status(404).send({ success: false, message: "Account doesn't exist" });
        } else {
            // Vérification du mot de passe avec bcrypt
            let isCorrectPassword = await bcrypt.compare(password, user.password);

            if (isCorrectPassword) {
                // Suppression du mot de passe du document utilisateur avant de l'envoyer dans la réponse
                delete user._doc.password;

                // Vérification si le compte de l'utilisateur est actif
                if (!user.isActive) {
                    return res.status(200).send({ success: false, message: 'Your account is inactive, Please contact your administrator' });
                }

                // Génération des tokens (accessToken et refreshToken)
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                // Envoi de la réponse avec les tokens et les informations de l'utilisateur
                return res.status(200).send({ success: true, user, token, refreshToken });
            } else {
                // Si le mot de passe est incorrect
                return res.status(404).send({ success: false, message: "Please verify your credentials" });
            }
        }
    } catch (err) {
        // Gestion des erreurs
        return res.status(404).send({ success: false, message: err.message });
    }
});

// Fonction pour générer un token d'accès JWT
const generateAccessToken = (user) => {
    return jwt.sign({ iduser: user._id, role: user.role }, process.env.SECRET, {
        expiresIn: '60s' // Expiration du token après 60 secondes
    });
}

// Fonction pour générer un token de rafraîchissement JWT
function generateRefreshToken(user) {
    return jwt.sign({ iduser: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' }); // Expiration du token après 1 an
}

// Route pour rafraîchir le token d'accès
router.post('/refreshToken', async (req, res) => {
    console.log(req.body.refreshToken); // Affichage du token dans la console (pour le debug)

    // Récupération du token de rafraîchissement depuis la requête
    const refreshtoken = req.body.refreshToken;

    // Vérification si le token est présent
    if (!refreshtoken) {
        return res.status(404).send({ success: false, message: 'Token Not Found' });
    } else {
        // Vérification de la validité du token avec jwt
        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(406).send({ success: false, message: 'Unauthorized' });
            } else {
                // Génération d'un nouveau token d'accès et d'un nouveau token de rafraîchissement
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                console.log("token-------", token); // Affichage du nouveau token

                // Envoi des nouveaux tokens en réponse
                res.status(200).send({
                    success: true,
                    token,
                    refreshToken
                });
            }
        });
    }
});

    module.exports = router;

