// ImgBB
import React, { useState } from "react";
import { Plus, X, Image, Clock, Users, Tags } from "lucide-react";
import axios from "axios";

const AddRecipeForm = ({editingRecipe}) => {
  const [recipe, setRecipe] = useState(
    editingRecipe || {
      title: "",
      description: "",
      ingredients: [""],
      directions: "",
      preparationTime: "",
      servings: "",
      tag: "",
      image: null,
      author: "",
    }
  );
  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...recipe[field]];
    newArray[index] = value;
    setRecipe({ ...recipe, [field]: newArray });
  };

  const addArrayField = (field) => {
    setRecipe({ ...recipe, [field]: [...recipe[field], ""] });
  };

  const removeArrayField = (index, field) => {
    const newArray = recipe[field].filter((_, i) => i !== index);
    setRecipe({ ...recipe, [field]: newArray });
  };

  // 🔹 Handle Image Upload (Now using ImgBB)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=2577d65e03c4989ee3e7b0224d0d92cc`, // 🔹 Replace with your ImgBB API Key
        formData
      );

      if (response.data.data.url) {
        setRecipe({ ...recipe, image: response.data.data.url }); // 🔹 Save ImgBB URL
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (imageUploading) {
      alert("Please wait, image is still uploading...");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to submit a recipe!");
      return;
    }
  
    if (!recipe.image) {
      alert("Please upload a recipe image!");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      let response;
  
      if (editingRecipe) {
        // 🔁 Update Recipe
        response = await axios.put(
          `http://localhost:3000/api/recipes/${editingRecipe._id}`,
          {
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            directions: recipe.directions,
            image: recipe.image,
            tag: recipe.tag,
            preparationTime: recipe.preparationTime,
            servings: recipe.servings,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          alert("Recipe updated successfully!");
        }
      } else {
        // Add New Recipe
        response = await axios.post(
          "http://localhost:3000/api/recipes",
          {
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            directions: recipe.directions,
            image: recipe.image,
            tag: recipe.tag,
            preparationTime: recipe.preparationTime,
            servings: recipe.servings,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 201) {
          alert("Recipe added successfully!");
          setRecipe({
            title: "",
            description: "",
            ingredients: [""],
            directions: "",
            preparationTime: "",
            servings: "",
            tag: "",
            image: null,
          });
        }
      }
    } catch (error) {
      console.error("Error while submitting recipe:", error.response?.data || error.message);
      setError("Something went wrong while submitting the recipe.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6 w-full mx-auto">
      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading && <p className="text-blue-500 mt-2">Submitting...</p>}

      {/* Recipe Title */}
      <label className="block text-gray-700 font-medium mb-1">Recipe Title</label>
      <input
        type="text"
        name="title"
        value={recipe.title}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Enter recipe title"
      />

      {/* Description */}
      <label className="block text-gray-700 font-medium mt-4">Description</label>
      <textarea
        name="description"
        value={recipe.description}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Describe your recipe"
      ></textarea>

      {/* Ingredients */}
      <label className="block text-gray-700 font-medium mt-4">Ingredients</label>
      {recipe.ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => handleArrayChange(index, "ingredients", e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter ingredient"
          />
          <button
            type="button"
            onClick={() => removeArrayField(index, "ingredients")}
            className="text-green-500 hover:bg-red-100 p-2 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayField("ingredients")}
        className="flex items-center gap-2 text-green-500 mt-2"
      >
        <Plus size={18} /> Add Ingredient
      </button>

      {/* Directions */}
      <label className="block text-gray-700 font-medium mt-4">Directions</label>
      <textarea
        name="directions"
        value={recipe.directions}
        onChange={(e) => setRecipe({ ...recipe, directions: e.target.value })}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Write the steps to prepare the recipe"
        rows={5}
      />

      {/* Preparation Time */}
      <label className="text-gray-700 font-medium mt-4 flex items-center gap-2">
        <Clock size={18} /> Preparation Time (in mins)
      </label>
      <input
        type="number"
        name="preparationTime"
        min="1"
        max="500"
        value={recipe.preparationTime}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="e.g., 30"
      />

      {/* Servings */}
      <label className="text-gray-700 font-medium mt-4 flex items-center gap-2">
        <Users size={18} /> Servings
      </label>
      <input
        type="number"
        name="servings"
        min="1"
        max="50"
        value={recipe.servings}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="e.g., 4 people"
      />
      <label className="text-gray-700 font-medium mt-4 flex items-center gap-2">
        <Tags size={18} /> Tags
      </label>
      <input
        type="text"
        name="tag"
        value={recipe.tag}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Enter tags (Dessert, Main Course, Starter, Beverage, Salad, Snack)"
      />

      {/* Recipe Image Upload */}
      <label className="block text-gray-700 font-medium mt-4">Recipe Image</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {imageUploading && <p className="text-blue-500 mt-2">Uploading image...</p>}
        {recipe.image && (
        <img
          src={recipe.image}
          alt="Uploaded recipe"
          className="mt-4 rounded-lg w-full max-h-64 object-cover"
          />
        )}

      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 mt-4 text-white bg-green-700 rounded-lg hover:bg-green-600"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Save Recipe"}
      </button>
    </form>
  );
};

export default AddRecipeForm;


// Cloudinary
// import React, { useState } from "react";
// import { Plus, X, Image, Clock, Users } from "lucide-react";

// const AddRecipeForm = () => {
//   const [recipe, setRecipe] = useState({
//     title: "",
//     description: "",
//     ingredients: [""],
//     directions: [""],
//     preparationTime: "",
//     servings: "",
//     tag: "",
//     image: null,
//     author: "", // Added author field
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [imageUploading, setImageUploading] = useState(false);

//   const handleChange = (e) => {
//     setRecipe({ ...recipe, [e.target.name]: e.target.value });
//   };

//   const handleArrayChange = (index, field, value) => {
//     const newArray = [...recipe[field]];
//     newArray[index] = value;
//     setRecipe({ ...recipe, [field]: newArray });
//   };

//   const addArrayField = (field) => {
//     setRecipe({ ...recipe, [field]: [...recipe[field], ""] });
//   };

//   const removeArrayField = (index, field) => {
//     const newArray = recipe[field].filter((_, i) => i !== index);
//     setRecipe({ ...recipe, [field]: newArray });
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImageUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "Cooksy_Img_Preset");

//     try {
//       const response = await fetch("https://api.cloudinary.com/v1_1/dsetjivwn/image/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       if (data.secure_url) {
//         setRecipe({ ...recipe, image: data.secure_url });
//       }
//     } catch (error) {
//       console.error("Image upload failed:", error);
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("You need to be logged in to submit a recipe!");
//       return;
//     }
  
//     setLoading(true);
//     setError("");
  
//     try {
//       const response = await fetch("http://localhost:3000/api/recipes", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title: recipe.title,
//           description: recipe.description,
//           ingredients: recipe.ingredients,
//           directions: recipe.directions,
//           preparationTime: recipe.preparationTime,
//           servings: recipe.servings,
//           tag: recipe.tag,
//           image: recipe.image || "https://www.pexels.com/photo/fresh-sourdough-pizza-on-plate-10836977/",
//         }),
//       });
  
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || "Something went wrong");
  
//       alert("Recipe added successfully!");
//       setRecipe({
//         title: "",
//         description: "",
//         ingredients: [""],
//         directions: [""],
//         preparationTime: "",
//         servings: "",
//         tag: "",
//         image: null,
//       });
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <form onSubmit={handleSubmit} className="p-6 w-full mx-auto">
//       {/* <h2 className="text-2xl font-bold text-gray-800 mb-3">Add Your Recipe</h2> */}
//       {/* <p className="text-gray-600 mb-4">Share your delicious creations with the world!</p> */}

//       {/* Error Message */}
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {loading && <p className="text-blue-500 mt-2">Submitting...</p>}

//       {/* Recipe Title */}
//       <label className="block text-gray-700 font-medium mb-1">Recipe Title</label>
//       <input
//         type="text"
//         name="title"
//         value={recipe.title}
//         onChange={handleChange}
//         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         placeholder="Enter recipe title"
//       />

//       {/* Description */}
//       <label className="block text-gray-700 font-medium mt-4">Description</label>
//       <textarea
//         name="description"
//         value={recipe.description}
//         onChange={handleChange}
//         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         placeholder="Describe your recipe"
//       ></textarea>

//       {/* Ingredients */}
//       <label className="block text-gray-700 font-medium mt-4">Ingredients</label>
//       {recipe.ingredients.map((ingredient, index) => (
//         <div key={index} className="flex gap-2 mb-2">
//           <input
//             type="text"
//             value={ingredient}
//             onChange={(e) => handleArrayChange(index, "ingredients", e.target.value)}
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             placeholder="Enter ingredient"
//           />
//           <button
//             type="button"
//             onClick={() => removeArrayField(index, "ingredients")}
//             className="text-green-500 hover:bg-red-100 p-2 rounded-lg"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={() => addArrayField("ingredients")}
//         className="flex items-center gap-2 text-green-500 mt-2"
//       >
//         <Plus size={18} /> Add Ingredient
//       </button>

//       {/* Author Name
//       <label className="block text-gray-700 font-medium mt-4">Author Name</label>
//       <input
//         type="text"
//         name="author"
//         value={recipe.author}
//         onChange={handleChange}
//         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         placeholder="Enter author's name"
//       /> */}

//       {/* Preparation Time */}
//       <label className="text-gray-700 font-medium mt-4 flex items-center gap-2">
//         <Clock size={18} /> Preparation Time (in mins)
//       </label>
//       <input
//         type="number"
//         name="preparationTime"
//         min="1"
//         max="500"
//         value={recipe.preparationTime}
//         onChange={handleChange}
//         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         placeholder="e.g., 30"
//       />

//       {/* Servings */}
//       <label className="text-gray-700 font-medium mt-4 flex items-center gap-2">
//         <Users size={18} /> Servings
//       </label>
//       <input
//         type="number"
//         name="servings"
//         min="1"
//         max="50"
//         value={recipe.servings}
//         onChange={handleChange}
//         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         placeholder="e.g., 4 people"
//       />

//       {/* Tag */}
//       <label className="block text-gray-700 font-medium mt-4">Tag</label>
//       <input
//         type="text"
//         name="tag"
//         value={recipe.tag}
//         onChange={handleChange}
//         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         placeholder="e.g., Vegetarian"
//       />

//       {/* Recipe Image */}
//       <label className="block text-gray-700 font-medium mt-4">Recipe Image</label>
//       <div className="relative">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         {imageUploading && <p className="text-blue-500 mt-2">Uploading image...</p>}
//       </div>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         className="w-full py-3 mt-4 text-white bg-green-700 rounded-lg hover:bg-green-600"
//         disabled={loading}
//       >
//         {loading ? "Submitting..." : "Add Recipe"}
//       </button>
//     </form>
//   );
// };

// export default AddRecipeForm;
