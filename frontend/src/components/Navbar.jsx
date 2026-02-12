import React, { useState } from 'react';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../context/store';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../utils/helpers';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="bg-primary text-white rounded-lg p-2 font-bold">PM</div>
            <h1 className="text-xl font-bold text-dark hidden sm:block">ProjectHub</h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/dashboard')} className="text-secondary hover:text-dark">
              Dashboard
            </button>
            <button onClick={() => navigate('/projects')} className="text-secondary hover:text-dark">
              Projects
            </button>
            {user?.role === 'Admin' && (
              <button onClick={() => navigate('/admin')} className="text-secondary hover:text-dark">
                Admin
              </button>
            )}
            <button onClick={() => navigate('/profile')} className="text-secondary hover:text-dark">
              Profile
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-light rounded-full px-4 py-2">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <span className="text-sm font-semibold">{user?.firstName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-light rounded-lg transition"
            >
              <FiLogOut size={20} />
            </button>

            <button
              className="md:hidden p-2 hover:bg-light rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            <button
              onClick={() => {
                navigate('/dashboard');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-light"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate('/projects');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-light"
            >
              Projects
            </button>
            {user?.role === 'Admin' && (
              <button
                onClick={() => {
                  navigate('/admin');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-light"
              >
                Admin
              </button>
            )}
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-light"
            >
              Profile
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
