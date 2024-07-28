// src/components/Navbar.js
import React, { useContext } from 'react';
import { UserContext } from '../custom-hooks/user';
import logo from './logo.png'; // Adjust the path to your logo
import '../index.css';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    setUser(null);
    // Additional logout logic if needed
  };

  return (
    <nav className="bg-white shadow-md fixed-navbar">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <img src={logo} alt="SEMA Logo" className="navbar-logo" />
        {user && (
          <div className="flex items-center">
            <p className="text-gray-800 mr-4">Hello {user.username}</p>
            <button 
              onClick={handleLogout} 
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;