import { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import ArticleCategory from "./ArticleCategory";
import { ChevronDown } from "lucide-react";
import image from  './SATYA.png' 
const Navbar = () => {
    const categories = [
        "Politics",
        "Business",
        "Technology",
        "Sports",
        "Entertainment",
        "Health",
        "Science",
        "World",
        "Lifestyle",
      ];
 const [issel, setIsel] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!issel);
  };
    const { user, setUser } = useContext(UserContext);
    console.log(user);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <nav className="bg-gray-900 text-white py-4 shadow-lg sticky top-0 w-full z-50">
  <div className="container mx-auto flex h-auto justify-between items-center px-6">
    {/* Logo */}
    <Link to="/" className="text-3xl font-extrabold tracking-wide text-yellow-400">
      <img className="h-auto w-[30vw]  md:w-[10vw]" src={image} alt="" />
    </Link>

    {/* Mobile Menu Toggle */}
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="text-yellow-400 text-2xl">
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
    </div>

    {/* Navigation Links (Desktop & Mobile) */}
    <div
      className={`absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent p-6 md:p-0 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 transition-all duration-300 ease-in-out ${
        isOpen ? "block" : "hidden md:flex"
      }`}
    >
      <Link to="/about" className="hover:text-yellow-300 transition">
        About Us
      </Link>
      <Link to="/contact" className="hover:text-yellow-300 transition">
        Contact Us
      </Link>
      <div className="relative group inline-block">
      {/* Categories Trigger */}
      <div
        className="flex items-center cursor-pointer hover:underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        Categories
        <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" 
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute  left-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg border border-gray-200">
          {categories.map((category, index) => (
            <a
              key={index}
              href={`/category/${category}`}
              className="block px-4 py-2 text-sm hover:bg-gray-200"
            >
              {category}
            </a>
          ))}
        </div>
      )}
    </div>
    </div>

    {/* Authentication Section */}
    <div
      className={`absolute md:relative top-[10rem] md:top-0 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent p-6 md:p-0 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 transition-all duration-300 ease-in-out ${
        isOpen ? "block" : "hidden md:flex"
      }`}
    >
      {user ? (
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <span className="font-medium text-xl text-yellow-400 px-4 py-2 border border-white cursor-pointer hover:bg-yellow-50 hover:text-yellow-500">
            Welcome, {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-500 transition"
        >
          Login
        </Link>
      )}
      {user && user.role === "admin" && (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Link
            className="px-4 py-2 border border-white hover:bg-white hover:text-black font-bold text-xl"
            to="/createpost"
          >
            Create Post
          </Link>
          <Link
            className="px-4 py-2 border border-white hover:bg-white hover:text-black font-bold text-xl"
            to={`/yourarticles/${user._id}`}
          >
            View your articles
          </Link>
        </div>
      )}
    </div>
  </div>
</nav>
    );
};

export default Navbar;