 const mongoose = require('mongoose');
 let Schema = mongoose.Schema;
 let groupSchema = new Schema({
      name:String,
      status:Boolean
 });
 let Group = mongoose.model('Group',groupSchema);
 module.exports = Group;