const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    addToFavorites,
    removeFromFavorites,
    getUserFavorites
} = require("../controllers/favoriteController");

const router = express.Router();

// Routes with Controllers
router.post("/:recipeId", authMiddleware, addToFavorites);
router.delete("/:recipeId", authMiddleware, removeFromFavorites);
router.get("/", authMiddleware, getUserFavorites);

module.exports = router;