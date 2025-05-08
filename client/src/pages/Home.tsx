import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Shield, Clock, BarChart, ArrowRight } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import type { File } from '../types';

const Home: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleUploadSuccess = (file: File) => {
    setUploadedFile(file);
  };

  return (
    <div className="min-h-screen">
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Share files <span className="text-primary-600 dark:text-primary-400">securely</span> and{' '}
            <span className="text-primary-600 dark:text-primary-400">easily</span>
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto"
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
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md max-w-md mx-auto border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                File uploaded successfully!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4 truncate">{uploadedFile.name}</p>
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  value={uploadedFile.shareUrl}
                  readOnly
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(uploadedFile.shareUrl)}
                    className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Copy Link
                  </button>
                  <Link
                    to={`/file/${uploadedFile._id}`}
                    className="flex-1 py-2 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-sm font-medium rounded-md transition-colors"
                  >
                    View File
                  </Link>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="py-2 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Sharepod?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              A modern file sharing platform designed with security, simplicity, and convenience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Easy Sharing</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Share files with anyone using a simple link. No account required for recipients.
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Secure Transfer</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Files are stored and transferred securely.
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Automatic Expiry</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Set expiration dates to control file availability.
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Download Analytics</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Track file downloads with simple analytics.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to share files securely?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Start uploading and managing your files now.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
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
