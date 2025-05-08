import React from 'react';
import { Loader } from 'lucide-react';

const LoaderComponent: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <Loader className="h-8 w-8 animate-spin text-primary-500" />
      <span className="ml-2 text-slate-600 dark:text-slate-400">Loading...</span>
    </div>
  );
};

export default LoaderComponent;