import React, { useEffect, useState, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner, EmptyState } from '../components/States';
import { adminAPI } from '../services/apiService';
import { getRelativeTime } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiUsers, FiFolder, FiActivity, FiTrash2 } from 'react-icons/fi';

const roleOptions = ['Admin', 'ProjectManager', 'TeamMember'];

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getUsers({ search, limit: 20 });
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getProjects({ limit: 20 });
      setProjects(response.data.projects || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getActivity({ limit: 20 });
      setActivities(response.data.logs || []);
    } catch (error) {
      toast.error('Failed to load activity logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'projects') {
      fetchProjects();
    } else {
      fetchActivity();
    }
  }, [activeTab, fetchActivity, fetchProjects, fetchUsers]);

  const handleRoleChange = async (userId, role) => {
    try {
      const response = await adminAPI.updateUserRole(userId, { role });
      setUsers((prev) => prev.map((user) => (user._id === userId ? response.data.user : user)));
      toast.success('Role updated');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      const response = await adminAPI.updateUserStatus(userId, { isActive: !isActive });
      setUsers((prev) => prev.map((user) => (user._id === userId ? response.data.user : user)));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project and its tasks?')) return;
    try {
      await adminAPI.deleteProject(projectId);
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-dark">Admin Panel</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
            >
              <FiUsers className="inline-block mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'projects'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
            >
              <FiFolder className="inline-block mr-2" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'activity'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
            >
              <FiActivity className="inline-block mr-2" />
              Activity
            </button>
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2">Name</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b last:border-0">
                        <td className="py-3">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg"
                          >
                            {roleOptions.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="No users found" icon={FiUsers} />
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-lg shadow p-6">
            {isLoading ? (
              <LoadingSpinner />
            ) : projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2">Project</th>
                      <th className="py-2">Owner</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Visibility</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project._id} className="border-b last:border-0">
                        <td className="py-3">{project.name}</td>
                        <td className="py-3">
                          {project.owner?.firstName} {project.owner?.lastName}
                        </td>
                        <td className="py-3">{project.status}</td>
                        <td className="py-3">{project.visibility}</td>
                        <td className="py-3">
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="p-2 hover:bg-red-100 text-danger rounded-lg"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="No projects found" icon={FiFolder} />
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow p-6">
            {isLoading ? (
              <LoadingSpinner />
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-dark">{activity.description}</p>
                      <span className="text-xs text-gray-500">
                        {getRelativeTime(activity.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user?.firstName} {activity.user?.lastName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No activity found" icon={FiActivity} />
            )}
          </div>
        )}
      </div>
    </>
  );
};
