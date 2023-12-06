var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AuthenticationSchema = new Schema({
    created_at: { type: Date, required: false },
    login: { type: String, required: true, min: 3, max: 30},
    access_token: { type: String, required: false },
    status: { type: String, required: false, enum: ["Expirado", "Bloqueado", "Suspenso", "Ativo"], default: "Ativo" },
});

// Virtual for authentication description and name
AuthenticationSchema.virtual("description_name").get(function () {
    return this.description + " " + this.name;
});

// // Virtual for authentication's URL
// AuthenticationSchema.virtual("url").get(function () {
//     return "/system/authentication/" + this._id;
// });

//Export model
module.exports = mongoose.model("Authentication", AuthenticationSchema);
