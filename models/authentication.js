var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AuthenticationSchema = new Schema({
    created_at: { type: Date },
    name: { type: String, required: true },
    login: { type: String, required: true, min: 3, max: 30},
    password: { type: String, required: true, min: 6, max: 20 },
    status: { type: String, required: true, enum: ["Ativo", "Bloqueado", "Suspenso"], default: "Não triado" },
    type: { type: String, required: true, enum: ["Tipo 1", "Tipo 2", "Tipo 3"], default: "Tipo 3" },
    updated_at: { type: Date },
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
