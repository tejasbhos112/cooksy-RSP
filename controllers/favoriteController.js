const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe");

//  Add a Recipe to Favorites
exports.addToFavorites = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        // Check if the recipe exists
        const recipeExists = await Recipe.findById(recipeId);
        if (!recipeExists) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Check if already favorited
        const alreadyFavorited = await Favorite.findOne({ user: userId, recipe: recipeId });
        if (alreadyFavorited) {
            return res.status(400).json({ message: "Recipe is already in favorites" });
        }

        // Add to favorites
        const favorite = new Favorite({ user: userId, recipe: recipeId });
        await favorite.save();

        res.status(201).json({ message: "Recipe added to favorites", favorite });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Remove a Recipe from Favorites
exports.removeFromFavorites = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        const favorite = await Favorite.findOneAndDelete({ user: userId, recipe: recipeId });

        if (!favorite) {
            return res.status(404).json({ message: "Recipe not found in favorites" });
        }

        res.json({ message: "Recipe removed from favorites" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Get User’s Favorite Recipes
exports.getUserFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favorites = await Favorite.find({ user: userId }).populate("recipe");

        res.json(favorites);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
