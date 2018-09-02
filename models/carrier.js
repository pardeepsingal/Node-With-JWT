const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let CarrierSchema = new Schema({
    name:String,
    status:Boolean
});

let Carrier = mongoose.model('Carrier',CarrierSchema);
module.exports = Carrier;