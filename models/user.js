const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userSchema = new Schema({
    name:String,
    username:{type:String, unique:true, required:true},
    password:{type:String,required:true},
    admin:Boolean,
    location:String,
    meta:{
        age:Number,
        website:String
    },
    created_at:Date,
    updated_at:Date
});

let User = mongoose.model('User',userSchema);

module.exports = User;