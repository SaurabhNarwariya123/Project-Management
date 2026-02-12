import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner, EmptyState } from '../components/States';
import { TaskCard, ProjectCard } from '../components/Cards';
import { useAuthStore, useProjectStore, useTaskStore } from '../context/store';
import { projectAPI, taskAPI } from '../services/apiService';
import toast from 'react-hot-toast';
import { FiFolder, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, setProjects, isLoading, setLoading } = useProjectStore();
  const { tasks, setTasks } = useTaskStore();
  const [activeTab, setActiveTab] = useState('projects');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const projectsRes = await projectAPI.getProjects({ limit: 5 });
      const projectsData = projectsRes.data.projects || [];
      setProjects(projectsData);

      let tasksData = [];
      if (projectsData.length > 0) {
        const projectId = projectsData[0]._id;
        const tasksRes = await taskAPI.getTasksByProject(projectId, { limit: 5 });
        tasksData = tasksRes.data.tasks || [];
      }

      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setProjects, setTasks]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-dark mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Projects</p>
                  <p className="text-3xl font-bold text-dark">{projects.length}</p>
                </div>
                <FiFolder size={40} className="text-primary opacity-20" />
              </div>
            </div>

            {user?.role === 'Admin' && (
              <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-dark">Admin Panel</h2>
                  <p className="text-gray-600">Manage users, projects, and activity logs.</p>
                </div>
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Open Admin Panel
                </button>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold text-dark">{tasks.length}</p>
                </div>
                <FiCheckCircle size={40} className="text-success opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed Tasks</p>
                  <p className="text-3xl font-bold text-dark">
                    {tasks.filter((t) => t.status === 'Done').length}
                  </p>
                </div>
                <FiCheckCircle size={40} className="text-success opacity-20" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'projects'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
            >
              Recent Projects
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'tasks'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
            >
              Recent Tasks
            </button>
          </div>

          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length > 0 ? (
                projects.map((project) => <ProjectCard key={project._id} project={project} />)
              ) : (
                <EmptyState
                  message="No projects yet. Create one to get started!"
                  icon={FiFolder}
                  action={() => navigate('/projects')}
                  actionLabel="Create Project"
                />
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.length > 0 ? (
                tasks.map((task) => <TaskCard key={task._id} task={task} />)
              ) : (
                <EmptyState
                  message="No tasks yet. Create one to get started!"
                  icon={FiCheckCircle}
          />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
