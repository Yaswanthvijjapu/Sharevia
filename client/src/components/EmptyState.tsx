import React, { useContext } from 'react';
import { Upload } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

interface EmptyStateProps {
  title: string;
  description: string;
  onUpload: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, onUpload }) => {
  
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="text-center py-16">
      <div className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} mb-4`}>
        <Upload className="h-12 w-12" />
      </div>
      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
      <button
        onClick={onUpload}
        className={`mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload a File
      </button>
    </div>
  );
};

export default EmptyState;