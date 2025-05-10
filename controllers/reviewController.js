const Review = require("../models/Review");
const Recipe = require("../models/Recipe");

// Add a Review to a Recipe
exports.addReview = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // Check if the recipe exists
        const recipeExists = await Recipe.findById(recipeId);
        if (!recipeExists) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Ensure the user hasn't already reviewed the recipe
        const existingReview = await Review.findOne({ recipe: recipeId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this recipe" });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Add review
        const review = new Review({ recipe: recipeId, user: userId, rating, comment });

        await review.save();
        res.status(201).json({ message: "Review added successfully", review });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Get Reviews for a Recipe
exports.getReviews = async (req, res) => {
    try {
        const { recipeId } = req.params;

        // Check if the recipe exists
        const recipeExists = await Recipe.findById(recipeId);
        if (!recipeExists) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Retrieve reviews and populate user info
        const reviews = await Review.find({ recipe: recipeId }).populate("user", "name");

        res.json(reviews);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
