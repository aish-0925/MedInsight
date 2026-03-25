// client/src/components/Navbar.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>
            MedInsight
          </h1>
          <div className="hidden md:flex space-x-6">
            <a href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded transition">Dashboard</a>
            <a href="/patients" className="hover:bg-blue-700 px-3 py-2 rounded transition">Patients</a>
            <a href="/appointments" className="hover:bg-blue-700 px-3 py-2 rounded transition">Appointments</a>
            <a href="/inventory" className="hover:bg-blue-700 px-3 py-2 rounded transition">Inventory</a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-blue-100">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;