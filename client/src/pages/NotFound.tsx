import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const NotFound: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <h1 className={`text-9xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>404</h1>
      <p className={`text-2xl font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mt-4 mb-6`}>
        Page not found
      </p>
      <p className={`text-slate-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-center max-w-md mb-8`}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
      >
        <Home className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;