import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-blue-600">
              SmartRecruit
            </span>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <button className="font-medium">Login</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
