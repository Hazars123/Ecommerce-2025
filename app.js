const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
// Routes
const CategorieRouter = require('./routes/categorie.route.js');
const sCategorieRouter = require('./routes/scategorie.route.js');
const articleRouter = require('./routes/article.route.js');
const chatbotRouter = require('./routes/chatbot.route.js');
const userRouter =require("./routes/user.route.js");

// Test route
app.get('/', (req, res) => {
    res.send('Bienvenue dans notre site');
});

// Database connection
mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log('Connexion à la base de données réussie');
    })
    .catch((error) => {
        console.error('Impossible de se connecter à la base de données:', error);
        process.exit(1); // Exit the process with a failure code
    });
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});
// API routes
app.use('/api/categories', CategorieRouter);
app.use('/api/scategories', sCategorieRouter); // Fixed typo in route path
app.use('/api/articles', articleRouter); // Fixed typo in route path
app.use('/api/chat', chatbotRouter);
app.use('/api/users',userRouter);


// Start the server
const PORT = process.env.PORT || 5000; // Fallback port if not specified in .env
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// Export the app for testing or other modules
module.exports = app;