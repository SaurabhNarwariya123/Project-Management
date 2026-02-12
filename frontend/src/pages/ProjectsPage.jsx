import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner, EmptyState } from '../components/States';
import { ProjectCard } from '../components/Cards';
import { useProjectStore } from '../context/store';
import { projectAPI } from '../services/apiService';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, setProjects, isLoading, setLoading } = useProjectStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'Private',
  });

  useEffect(() => {
    fetchProjects();
  }, [search, filterStatus]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      };
      const response = await projectAPI.getProjects(params);
      setProjects(response.data.projects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await projectAPI.createProject(formData);
      setProjects([response.data.project, ...projects]);
      setFormData({ name: '', description: '', visibility: 'Private' });
      setShowModal(false);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(projectId);
        setProjects(projects.filter((p) => p._id !== projectId));
        toast.success('Project deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark">Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus size={20} />
            New Project
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="OnHold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No projects found. Create one to get started!"
            icon={FiPlus}
            action={() => setShowModal(true)}
            actionLabel="Create First Project"
          />
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-dark mb-4">Create New Project</h2>
              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  ></textarea>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark mb-2">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-dark py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
