// Stores user-favorited recipes.

const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
