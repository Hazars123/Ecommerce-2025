const mongoose = require("mongoose")
const categorieSchema=mongoose.Schema({
    nomCategorie:{type:String, required:true,unique:true},
    imageCategorie:{type:String,required:false}})
    module.exports=mongoose.model('categorie',categorieSchema)
