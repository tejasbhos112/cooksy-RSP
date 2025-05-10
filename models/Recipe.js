const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Recipe title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [100, "Title must be at most 100 characters long"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [10, "Description must be at least 10 characters long"]
    },
    ingredients: [{
        type: String,
        required: [true, "At least one ingredient is required"],
        trim: true
    }],
    directions: [{
        type: String,
        required: [true, "At least one direction step is required"],
        trim: true
    }],
    image: {
        type: String,
        default: "",
    },
    preparationTime: { 
        type: Number, 
        required: [true, "Preparation time is required"],
        min: [1, "Preparation time must be at least 1 minute"],
        max: [500, "Preparation time cannot exceed 500 minutes"]
    },
    servings: { 
        type: Number, 
        required: [true, "Servings information is required"],
        min: [1, "Servings must be at least 1"],
        max: [50, "Servings cannot exceed 50"]
    },
    tag: {
        type: String,
        required: [true, "Tag (category) is required"],
        trim: true,
        enum: {
            values: ["Dessert", "Main Course", "Starter", "Beverage", "Salad", "Snack"],
            message: "Invalid tag. Choose from: Dessert, Main Course, Starter, Beverage, Salad, or Snack"
        }
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author ID is required"]
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Recipe", recipeSchema);
