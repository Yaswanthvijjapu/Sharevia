
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Shield, Clock, BarChart, ArrowRight, Sun, Moon } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { ThemeContext } from '../context/ThemeContext';
import type { File } from '../types';

const Home: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const handleUploadSuccess = (file: File) => {
    setUploadedFile(file);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-800' : 'bg-transparent'}`}>
      {/* Header Section */}
      <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-slate-800' : 'bg-transparent'} shadow-sm`}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Sharepod</h1>
          <nav className="flex items-center space-x-4">
            <Link to="/dashboard" className={`text-sm font-medium ${isDarkMode ? 'text-slate-300 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>
              Dashboard
            </Link>
            <Link to="/dashboard" className={`text-sm font-medium ${isDarkMode ? 'text-slate-300 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}>
              Upload
            </Link>
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors`}
            >
              {isDarkMode ? <Sun size={20} className="text-indigo-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Share files <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>securely</span> and{' '}
            <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>easily</span>
          </motion.h1>
          <motion.p
            className={`text-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-10 max-w-3xl mx-auto`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Upload, share, and track your files with secure links that expire automatically.
          </motion.p>
          {!uploadedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </motion.div>
          ) : (
            <motion.div
              className={`p-6 rounded-lg shadow-md max-w-md mx-auto border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                File uploaded successfully!
              </h3>
              <p className={`mb-4 truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{uploadedFile.name}</p>
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  value={uploadedFile.shareUrl}
                  readOnly
                  className={`w-full px-3 py-2 text-sm border rounded-md ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(uploadedFile.shareUrl)}
                    className={`flex-1 py-2 px-4 text-white text-sm font-medium rounded-md transition-colors ${isDarkMode ? 'bg-indigo-400 hover:bg-indigo-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    Copy Link
                  </button>
                  <Link
                    to={`/file/${uploadedFile._id}`}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
                  >
                    View File
                  </Link>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className={`py-2 px-4 text-sm font-medium rounded-md border transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                >
                  Upload Another File
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Why Choose Sharepod?</h2>
            <p className={`text-lg max-w-3xl mx-auto ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              A modern file sharing platform designed with security, simplicity, and convenience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Share2 className={`h-6 w-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />,
                title: 'Easy Sharing',
                description: 'Share files with anyone using a simple link. No account required for recipients.',
              },
              {
                icon: <Shield className={`h-6 w-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />,
                title: 'Secure Transfer',
                description: 'Files are stored and transferred securely.',
              },
              {
                icon: <Clock className={`h-6 w-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />,
                title: 'Automatic Expiry',
                description: 'Set expiration dates to control file availability.',
              },
              {
                icon: <BarChart className={`h-6 w-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />,
                title: 'Download Analytics',
                description: 'Track file downloads with simple analytics.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>{feature.title}</h3>
                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-6`}>
            Ready to share files securely?
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-8`}>
            Start uploading and managing your files now.
          </p>
          <Link
            to="/dashboard"
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors ${isDarkMode ? 'bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;