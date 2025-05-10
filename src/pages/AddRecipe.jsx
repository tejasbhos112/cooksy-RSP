import React from "react";
import { Utensils } from "lucide-react";
import AddRecipeForm from "../components/AddRecipeForm";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

const AddRecipe = () => {
  const location = useLocation();
  const editingRecipe = location.state?.recipe ?? null; // Check for edit mode

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar (Fixed on Left) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Utensils size={28} className="text-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {editingRecipe ? "Edit Recipe" : "Add Your Recipe"}
                </h1>
                <p className="text-gray-600">
                  {editingRecipe
                    ? "Update your delicious recipe details."
                    : "Share your delicious creations with the world!"}
                </p>
              </div>
            </div>
          </div>

          {/* Recipe Form */}
          <div className="max-h-[80vh] overflow-y-auto w-full px-4">
            <AddRecipeForm editingRecipe={editingRecipe} /> {/* Pass recipe for editing */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
