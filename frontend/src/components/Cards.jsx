import React from 'react';
import { formatDate, getStatusColor, getPriorityColor } from '../utils/helpers';
import { FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const TaskCard = ({ task, onDelete, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3
          className="font-semibold text-dark cursor-pointer hover:text-primary flex-1"
          onClick={() => navigate(`/task/${task._id}`)}
        >
          {task.title}
        </h3>
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-primary">
              <FiEdit2 size={18} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(task._id)} className="text-gray-400 hover:text-danger">
              <FiTrash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600">
        <div className="flex items-center gap-1">
          {task.assignedTo && (
            <FiUser size={14} />
          )}
          {task.assignedTo && <span>{task.assignedTo.firstName}</span>}
        </div>
        {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
      </div>
    </div>
  );
};

export const ProjectCard = ({ project, onDelete, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h3
          className="font-semibold text-dark text-lg hover:text-primary flex-1"
          onClick={() => navigate(`/project/${project._id}`)}
        >
          {project.name}
        </h3>
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={() => onEdit(project)} className="text-gray-400 hover:text-primary">
              <FiEdit2 size={18} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(project._id)} className="text-gray-400 hover:text-danger">
              <FiTrash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>

      <div className="flex justify-between items-center text-xs text-gray-600">
        <span className={`px-2 py-1 rounded ${project.visibility === 'Public' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {project.visibility}
        </span>
        <span>{project.team.length} members</span>
      </div>
    </div>
  );
};
