import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <FiAlertCircle size={40} className="text-danger" />
    <p className="text-center text-gray-600">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Try Again
      </button>
    )}
  </div>
);

export const EmptyState = ({ message, icon: Icon, action, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    {Icon && <Icon size={48} className="text-gray-400 mb-4" />}
    <p className="text-gray-600 text-center mb-4">{message}</p>
    {action && (
      <button
        onClick={action}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {actionLabel || 'Add Item'}
      </button>
    )}
  </div>
);
