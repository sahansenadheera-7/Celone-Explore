import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold">
          C
        </div>

        <span className="text-xl font-bold text-teal-800">
          CelonExplore
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <Link
          to="/"
          className="hover:text-teal-700 transition"
        >
          Home
        </Link>

        <Link
          to="/attractions"
          className="hover:text-teal-700 transition"
        >
          Attractions
        </Link>

        <Link
          to="/hotels"
          className="hover:text-teal-700 transition"
        >
          Hotels
        </Link>

        <Link
          to="/restaurants"
          className="hover:text-teal-700 transition"
        >
          Restaurants
        </Link>

        <Link
          to="/about"
          className="hover:text-teal-700 transition"
        >
          About Us
        </Link>

        <Link
          to="/contact"
          className="hover:text-teal-700 transition"
        >
          Contact
        </Link>
      </div>

      {/* Login Button */}
      <button
        type="button"
        onClick={onLoginClick}
        className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-medium transition"
      >
        Login
      </button>

    </nav>
  );
};

export default Navbar;