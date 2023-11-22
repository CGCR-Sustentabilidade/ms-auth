var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AuthenticationSchema = new Schema({
    created_at: { type: Date },
    login: { type: String, required: true, min: 3, max: 30},
    password: { type: String, required: true, min: 6, max: 20 },
    token: { type: String, required: false },
    status: { type: String, required: true, enum: ["Ativo", "Bloqueado", "Suspenso"], default: "Expirado" },
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
