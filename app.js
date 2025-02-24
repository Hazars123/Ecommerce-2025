const express = require('express')
const mongoose = require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const app = express()
const CategorieRouter=require("./routes/categorie.route.js")
const sCategorieRouter = require("./routes/scategorie.route.js")
const articleRouter = require("./routes/article.route.js")
const chatbotRouter = require("./routes/chatbot.route.js")
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Bienvenue dans notre site')
})
//connexion à la bd
mongoose.connect(process.env.DATABASECLOUD)
.then(()=>{console.log("connexion à la bd reussite")})
.catch((error)=>{console.log("impossible à se connecter à la bd",error)
    process.exit()
})
app.use("/api/categories",CategorieRouter)
app.use("/api/scategorie",sCategorieRouter)
app.use("/api/article",articleRouter)
app.use("/api/chat",chatbotRouter)
app.listen(process.env.PORT, function() {
  console.log(`Server is listening on port ${process.env.PORT}`);
})

module.exports=app;