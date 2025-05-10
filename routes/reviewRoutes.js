const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addReview, getReviews } = require("../controllers/reviewController");

const router = express.Router();

// Routes with Controllers
router.post("/:recipeId", authMiddleware, addReview);
router.get("/:recipeId", getReviews);

module.exports = router;
