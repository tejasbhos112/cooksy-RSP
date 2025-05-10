import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
// import SearchRecipe from "./pages/SearchRecipe";
import Login from "./pages/Login";
import Signin from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
// import Admin from "./pages/Admin";
import RecipeInfo from "./pages/RecipeInfo";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        {/* <Route path="/search" element={<SearchRecipe />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        {/* <Route path="/admin" element={<Admin />} /> */}
        <Route path="/recipe/:id" element={<RecipeInfo />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
