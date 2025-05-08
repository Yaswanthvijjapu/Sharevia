import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-9xl font-bold text-primary-500">404</h1>
      <p className="text-2xl font-medium text-slate-700 dark:text-slate-300 mt-4 mb-6">
        Page not found
      </p>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <Home className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;