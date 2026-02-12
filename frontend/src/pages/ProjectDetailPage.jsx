import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner, EmptyState } from '../components/States';
import { TaskCard } from '../components/Cards';
import { projectAPI, taskAPI } from '../services/apiService';
import toast from 'react-hot-toast';
import { FiPlus, FiSettings, FiTrash2 } from 'react-icons/fi';
import { useProjectStore } from '../context/store';
import { useNavigate } from 'react-router-dom';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useProjectStore();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
  });

  const fetchProjectDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectAPI.getProjectById(projectId),
        taskAPI.getTasksByProject(projectId),
      ]);
      setCurrentProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks || []);
    } catch (error) {
      toast.error('Failed to fetch project details');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, setCurrentProject]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskAPI.createTask(projectId, taskFormData);
      setTasks((prev) => [response.data.task, ...prev]);
      setTaskFormData({ title: '', description: '', priority: 'Medium', status: 'Todo' });
      setShowTaskModal(false);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        toast.success('Task deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      try {
        await projectAPI.deleteProject(projectId);
        toast.success('Project deleted successfully!');
        navigate('/projects');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const filteredTasks =
    activeFilter === 'all' ? tasks : tasks.filter((t) => t.status === activeFilter);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentProject && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-dark">{currentProject.name}</h1>
                  <p className="text-gray-600 mt-2">{currentProject.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-light rounded-lg transition">
                    <FiSettings size={20} />
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="p-2 hover:bg-red-100 text-danger rounded-lg transition"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-gray-600 text-sm">Members</p>
                  <p className="text-2xl font-bold text-dark">
                    {currentProject.team.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold text-dark">{tasks.length}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-dark">
                    {tasks.filter((t) => t.status === 'InProgress').length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-dark">
                    {tasks.filter((t) => t.status === 'Done').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark">Tasks</h2>
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FiPlus size={20} />
                New Task
              </button>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto">
              {['all', 'Todo', 'InProgress', 'InReview', 'Done'].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    activeFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-light text-dark hover:bg-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All Tasks' : status}
                </button>
              ))}
            </div>

            {filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                message="No tasks yet. Create one to get started!"
                icon={FiPlus}
                action={() => setShowTaskModal(true)}
                actionLabel="Create First Task"
              />
            )}

            {showTaskModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-2xl font-bold text-dark mb-4">Create New Task</h2>
                  <form onSubmit={handleCreateTask}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-dark mb-2">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={taskFormData.title}
                        onChange={(e) =>
                          setTaskFormData({ ...taskFormData, title: e.target.value })
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
                        value={taskFormData.description}
                        onChange={(e) =>
                          setTaskFormData({
                            ...taskFormData,
                            description: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Priority
                        </label>
                        <select
                          value={taskFormData.priority}
                          onChange={(e) =>
                            setTaskFormData({
                              ...taskFormData,
                              priority: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Status
                        </label>
                        <select
                          value={taskFormData.status}
                          onChange={(e) =>
                            setTaskFormData({
                              ...taskFormData,
                              status: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        >
                          <option value="Todo">Todo</option>
                          <option value="InProgress">In Progress</option>
                          <option value="InReview">In Review</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-700"
                      >
                        Create Task
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTaskModal(false)}
                        className="flex-1 bg-gray-300 text-dark py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
