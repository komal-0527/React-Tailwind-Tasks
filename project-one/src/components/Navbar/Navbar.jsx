import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaHeart, FaSearch } from "react-icons/fa";

const Navbar = ({ onSearch, favorites }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query.trim());   // send query to App
    navigate("/");            // go to Home so results show
  };

  return (
    <div className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <Link to="/" className="logo">Netflix Clone</Link>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>

        {/* Favorites */}
        <Link to="/favorites" className="fav-link">
          <FaHeart className="heart-icon" />
          <span>{favorites.length}</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
