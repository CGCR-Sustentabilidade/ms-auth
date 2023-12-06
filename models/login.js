var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LoginSchema = new Schema({
    login: { type: String, required: true, min: 3, max: 30},
    password: { type: String, required: true, min: 6, max: 20 },
});

//Export model
module.exports = mongoose.model("Login", LoginSchema);
