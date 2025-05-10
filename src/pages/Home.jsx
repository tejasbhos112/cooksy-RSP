// Dynamic
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import RecipeCard from "../components/RecipeCard";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); // Filter state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown toggle
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  const categories = ["Dessert", "Main Course", "Starter", "Beverage", "Salad", "Snack"];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/recipes");

        const formattedRecipes = response.data.map((recipe) => ({
          _id: recipe._id,
          img: recipe.image, 
          title: recipe.title,
          author: recipe.author?.name ?? "Unknown",
          tag: typeof recipe.tag === "string" ? recipe.tag.split(",").map(t => t.trim()) : Array.isArray(recipe.tag) ? recipe.tag : [],
          rating: recipe.rating ?? "N/A",
          description: recipe.description ?? "No description available.",
          prepTime: recipe.preparationTime !== undefined ? `${recipe.preparationTime} mins` : "Unknown",
          servings: recipe.servings ?? "Unknown",
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
          directions: Array.isArray(recipe.directions) ? recipe.directions : [],
        }));
        

        setRecipes(formattedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on category and search query
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = selectedCategory ? recipe.tag.includes(selectedCategory) : true;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto bg-gray-100 p-6">
        {/* Search and Filter */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-lg px-3 py-2 pl-10 w-full md:w-1/2"
            />
            <Search className="absolute left-3 top-2 text-gray-500" size={18} />
          </div>

          {/* Dropdown Filter */}
          <div className="relative">
            <button
              className="px-4 py-2 border rounded-lg flex items-center gap-2 bg-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedCategory || "Meal Type"} <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative mb-10">
          <div className="bg-[url('https://images.pexels.com/photos/9004736/pexels-photo-9004736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center text-white rounded-lg p-10 md:p-16 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">Discover & Share Amazing Recipes</h1>
            <p className="text-lg mb-6">Join our community of food lovers and explore a world of flavors.</p>
            <Link to="/add-recipe">
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg text-lg font-semibold">
                Share Your Recipe
              </button>
            </Link>
          </div>
        </section>

        {/* Discover Recipes */}
        <h2 className="text-2xl font-semibold mb-4">Discover Recipes</h2>

        {loading ? (
          <p>Loading recipes...</p>
        ) : filteredRecipes.length === 0 ? (
          <p>No recipes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Link to={`/recipe/${recipe._id}`} state={{ recipe }}>
              <RecipeCard recipe={recipe} />
            </Link>                                   
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;