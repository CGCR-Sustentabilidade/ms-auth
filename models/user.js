var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    created_at: { type: Date, required: false },
    name: { type: String, required: true },
    login: { type: String, required: true, min: 3, max: 30},
    password: { type: String, required: true, min: 6, max: 20 },
    status: { type: String, required: false, enum: ["Ativo", "Bloqueado", "Suspenso"], default: "Não triado" },
    type: { type: String, required: false, enum: ["Tipo 1", "Tipo 2", "Tipo 3"], default: "Tipo 3" },
    updated_at: { type: Date },
});

// Virtual for user description and name
UserSchema.virtual("description_name").get(function () {
    return this.description + " " + this.name;
});

module.exports = mongoose.model("User", UserSchema);
