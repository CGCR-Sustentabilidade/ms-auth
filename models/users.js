var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    created_at: { type: Date },
    job_title: {
        type: String,
        required: true,
        enum: ["Ativo", "Inativo"],
        default: "Desativado",
    },
    first_name: { type: String, required: true, max: 100, min: 2 },
    last_name: { type: String, required: true, max: 100, min: 2 },
    status: {
        type: String,
        required: true,
        enum: ["Ativo", "Inativo"],
        default: "Desativado",
    },
    role: {
        type: Number, 
        required: true,
        default: 1,
    }
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
    return this.first_name + " " + this.last_name;
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
    return "/system/user/" + this._id;
});

//Export model
module.exports = mongoose.model("User", UserSchema);
