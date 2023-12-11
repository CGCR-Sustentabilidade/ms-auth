var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AuthenticationSchema = new Schema({
    access_token: { type: String, required: false },
    created_at: { type: Date, required: false },
    is_active: { type: Boolean, required: false },
    login: { type: String, required: true, min: 3, max: 30},
});

module.exports = mongoose.model("Authentication", AuthenticationSchema);