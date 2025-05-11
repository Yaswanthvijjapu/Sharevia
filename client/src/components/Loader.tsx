import React, { useContext } from 'react';
import { Loader } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const LoaderComponent: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="flex justify-center items-center py-16">
      <Loader className={`h-8 w-8 animate-spin ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
      <span className={`ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Loading...</span>
    </div>
  );
};

export default LoaderComponent;