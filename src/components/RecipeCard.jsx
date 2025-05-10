
// Dynamic
import React, { useState } from "react";
import axios from "axios";
import { Star, Bookmark, BookmarkCheck } from "lucide-react";

const RecipeCard = ({ recipe = {} }) => {
  const [saved, setSaved] = useState(false);

  const authToken = localStorage.getItem("token");

  const handleSave = async () => {
    if (!authToken) {
      alert("Please log in to save recipes.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/favorites/${recipe._id}`,
        {}, 
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.status === 201) {
        setSaved(true);
        alert("Recipe added to favorites!");
      }
    } catch (error) {
      console.error("Error saving recipe:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to save recipe.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      <button 
        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
        onClick={handleSave}
      >
        {saved ? (
          <BookmarkCheck className="text-green-500" size={20} />
        ) : (
          <Bookmark className="text-gray-500 hover:text-gray-700 transition" size={20} />
        )}
      </button>

      <img
        src={recipe.img || "https://via.placeholder.com/150"}
        alt={recipe.title || "Recipe Image"}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold">{recipe.title || "Untitled Recipe"}</h3>

        {/* Only display author if it's not "Unknown" */}
        {recipe.author && recipe.author !== "Unknown" && (
          <p className="text-gray-600 text-sm">By {recipe.author}</p>
        )}

        {/* Only display tags if available */}
        {Array.isArray(recipe.tag) && recipe.tag.length > 0 && (
          <div className="flex gap-2 mt-2">
            {recipe.tag.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-200 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Only display rating if it's not "N/A" */}
        {recipe.rating && recipe.rating !== "N/A" && (
          <div className="flex items-center mt-3">
            <Star className="text-yellow-500" size={16} />
            <span className="ml-1 text-gray-700">{recipe.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;