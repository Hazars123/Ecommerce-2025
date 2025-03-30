const mongoose = require("mongoose")
const categorieSchema=mongoose.Schema({
    nomCategorie:{type:String, required:true,unique:true},
imageCategorie: { type: String, required: false, validate: {
    validator: function(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
    },
    message: props => `${props.value} n'est pas une URL valide!`
}}})

    module.exports=mongoose.model('categorie',categorieSchema)
