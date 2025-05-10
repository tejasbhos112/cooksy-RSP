import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, PlusCircle, User, LogIn, LogOut } from "lucide-react";

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if a token exists in localStorage to determine login status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("userId"); 
    setIsLoggedIn(false);
    navigate("/"); 
  };

  return (
    <div className="w-64 h-screen bg-green-700 text-white p-6 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Cooksy</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/" className="flex items-center gap-2 hover:bg-green-600 p-2 rounded-lg">
            <Home size={20} /> Home
          </Link>
          <Link to="/add-recipe" className="flex items-center gap-2 hover:bg-green-600 p-2 rounded-lg">
            <PlusCircle size={20} /> Add Recipe
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 hover:bg-green-600 p-2 rounded-lg">
            <User size={20} /> Profile
          </Link>
        </nav>
      </div>

      {/* Bottom Section (Login/Logout Button) */}
      <div className="mt-auto">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-green-600 p-2 rounded-lg w-full"
          >
            <LogOut size={20} /> Logout
          </button>
        ) : (
          <Link to="/login" className="flex items-center gap-2 hover:bg-green-600 p-2 rounded-lg">
            <LogIn size={20} /> Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
