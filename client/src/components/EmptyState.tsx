import React from 'react';
import { Upload } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  onUpload: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, onUpload }) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto h-12 w-12 text-primary-500 mb-4">
        <Upload className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      <button
        onClick={onUpload}
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload a File
      </button>
    </div>
  );
};

export default EmptyState;