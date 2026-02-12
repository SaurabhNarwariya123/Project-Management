import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner } from '../components/States';
import { taskAPI, commentAPI, activityAPI } from '../services/apiService';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiEdit2, FiTrash2, FiMessageCircle } from 'react-icons/fi';
import { formatDate, getStatusColor, getPriorityColor, getRelativeTime } from '../utils/helpers';

export const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({});

  const fetchTaskDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const [taskRes, commentsRes, activitiesRes] = await Promise.all([
        taskAPI.getTaskById(taskId),
        commentAPI.getComments(taskId),
        activityAPI.getTaskActivity(taskId),
      ]);
      setTask(taskRes.data.task);
      setComments(commentsRes.data.comments || []);
      setActivities(activitiesRes.data.logs || []);
      setUpdateData(taskRes.data.task);
    } catch (error) {
      toast.error('Failed to fetch task details');
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await commentAPI.createComment(taskId, {
        text: commentText,
      });
      setComments([response.data.comment, ...comments]);
      setCommentText('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskAPI.updateTask(taskId, updateData);
      setTask(response.data.task);
      setShowUpdateForm(false);
      toast.success('Task updated!');
      fetchTaskDetails();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        toast.success('Task deleted!');
        navigate(-1);
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <FiArrowLeft size={20} />
          Back
        </button>

        {task && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-dark">{task.title}</h1>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowUpdateForm(!showUpdateForm)}
                      className="p-2 hover:bg-light rounded-lg"
                    >
                      <FiEdit2 size={20} />
                    </button>
                    <button
                      onClick={handleDeleteTask}
                      className="p-2 hover:bg-red-100 text-danger rounded-lg"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-sm px-3 py-1 rounded ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span
                    className={`text-sm px-3 py-1 rounded ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </div>

                {showUpdateForm && (
                  <form onSubmit={handleUpdateTask} className="mb-6 p-4 bg-light rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-dark mb-2">
                        Status
                      </label>
                      <select
                        value={updateData.status}
                        onChange={(e) =>
                          setUpdateData({ ...updateData, status: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Todo">Todo</option>
                        <option value="InProgress">In Progress</option>
                        <option value="InReview">In Review</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-dark mb-2">
                        Priority
                      </label>
                      <select
                        value={updateData.priority}
                        onChange={(e) =>
                          setUpdateData({ ...updateData, priority: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUpdateForm(false)}
                        className="bg-gray-300 text-dark px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 bg-light rounded-lg">
                  <div>
                    <p className="text-gray-600 text-sm">Due Date</p>
                    <p className="font-semibold">
                      {task.dueDate ? formatDate(task.dueDate) : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Assigned To</p>
                    <p className="font-semibold">
                      {task.assignedTo
                        ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                        : 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <FiMessageCircle size={20} />
                  Comments
                </h2>

                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Post
                    </button>
                  </div>
                </form>

                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-dark">
                              {comment.author.firstName} {comment.author.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {getRelativeTime(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-800">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600">No comments yet</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-dark mb-4">Activity</h3>
                {activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity._id} className="pb-3 border-b">
                        <p className="text-sm font-semibold text-dark">
                          {activity.user.firstName}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {getRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 text-sm">No activities yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
