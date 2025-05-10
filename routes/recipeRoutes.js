const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe
} = require("../controllers/recipeController");

const router = express.Router();

// Routes with Controllers
router.post("/", authMiddleware, createRecipe);
router.get("/",  getAllRecipes);
router.get("/:id",  getRecipeById);
router.put("/:id", authMiddleware, updateRecipe);
router.delete("/:id", authMiddleware, deleteRecipe);

module.exports = router;
