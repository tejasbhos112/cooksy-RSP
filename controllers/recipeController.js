// Handles recipe-related logic  
// Functions include creating, fetching, updating, and deleting recipes  

const Recipe = require("../models/Recipe");

// Create a New Recipe
exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, directions, image, tag, preparationTime,servings } = req.body;

        if (!title || !description || !ingredients || !directions || !tag) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            directions,
            image,
            tag,
            preparationTime,
            servings,
            author: req.user.id // Authenticated user's ID
        });

        await newRecipe.save();
        res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Get All Recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate("author", "name");
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Get a Single Recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate("author", "name");

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Edit a Recipe (Only Author Can Edit)
exports.updateRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, directions, image, tag } = req.body;
        let recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this recipe" });
        }

        // Update recipe
        recipe.title = title || recipe.title;
        recipe.description = description || recipe.description;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.directions = directions || recipe.directions;
        recipe.image = image || recipe.image;
        recipe.tag = tag || recipe.tag;

        await recipe.save();
        res.json({ message: "Recipe updated successfully", recipe });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Delete a Recipe (Only Author Can Delete)
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this recipe" });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: "Recipe deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
