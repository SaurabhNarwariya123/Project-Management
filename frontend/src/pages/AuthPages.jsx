import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/store';
import { authAPI } from '../services/apiService';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary text-white rounded-lg p-3 font-bold text-2xl mx-auto w-12 h-12 flex items-center justify-center mb-4">
            PM
          </div>
          <h1 className="text-2xl font-bold text-dark">ProjectHub</h1>
          <p className="text-gray-600 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Email or Username</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="admin or your@email.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-primary hover:underline font-semibold"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary text-white rounded-lg p-3 font-bold text-2xl mx-auto w-12 h-12 flex items-center justify-center mb-4">
            PM
          </div>
          <h1 className="text-2xl font-bold text-dark">ProjectHub</h1>
          <p className="text-gray-600 text-sm mt-1">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition text-sm"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
