
import React, { useContext, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Shield, Clock, BarChart, ArrowRight, Sun, Moon, Download, Copy, Trash2 } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { ThemeContext } from '../context/ThemeContext';
import type { File as CustomFile } from '../types';
import QRCode from 'react-qr-code';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<CustomFile | null>(null);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleUploadSuccess = (file: CustomFile) => {
    setUploadedFile(file);
    toast.success('File uploaded successfully!');
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertSVGToCanvas = (svgElement: SVGElement): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        resolve(canvas);
      };

      img.onerror = reject;
      img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
    });
  };

  const handleDownloadQR = async (_url: string) => {
    const qrSvg = qrCodeRef.current?.querySelector('svg');
    if (qrSvg) {
      try {
        const canvas = await convertSVGToCanvas(qrSvg);
        const qrImageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = qrImageUrl;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error converting SVG to Canvas:', error);
        toast.error('Failed to download QR code');
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setUploadedFile(null);
      toast.success('File deleted');
    }
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
        <div className="max-w-6xl mx-auto text-center">
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
              className={`p-8 rounded-xl shadow-lg space-y-6 ${isDarkMode ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-slate-200'}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Uploaded File</h3>
              <div className="overflow-x-auto">
                <table className={`w-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                  <thead>
                    <tr className={`${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <th className={`px-4 py-3 text-left text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Filename</th>
                      <th className={`px-4 py-3 text-left text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Type</th>
                      <th className={`px-4 py-3 text-left text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Size</th>
                      <th className={`px-4 py-3 text-left text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Uploaded</th>
                      <th className={`px-4 py-3 text-left text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Preview</th>
                      <th className={`px-4 py-3 text-left text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Download</th>
                      <th className={`px-4 py-3 text-left text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Actions</th>
                      <th className={`px-4 py-3 text-left text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      <td className={`border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} px-4 py-4 truncate text-base`} title={uploadedFile.name}>
                        {uploadedFile.name}
                      </td>
                      <td className={`border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} px-4 py-4 text-base`}>{uploadedFile.type}</td>
                      <td className={`border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} px-4 py-4 text-base`}>
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </td>
                      <td className={`border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} px-4 py-4 text-base`}>
                        {new Date(uploadedFile.createdAt).toLocaleString()}
                      </td>
                      <td className={`border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} px-4 py-4`}>
                        {uploadedFile.type.startsWith('image') && (
                          <img src={uploadedFile.shareUrl} alt={uploadedFile.name} className="h-24 w-24 object-cover rounded" />
                        )}
                        {uploadedFile.type.startsWith('video') && (
                          <video src={uploadedFile.shareUrl} className="h-24 w-24 object-cover rounded" controls />
                        )}
                      </td>
                      <td className={`border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} px-4 py-4`}>
                        <button
                          onClick={() => handleDownload(uploadedFile.shareUrl, uploadedFile.name)}
                          className={`flex items-center py-2 px-4 text-base rounded-lg ${isDarkMode ? 'bg-indigo-400 text-white hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                          <Download className="h-5 w-5 mr-2" /> Download
                        </button>
                      </td>
                      <td className={`border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} px-4 py-4`}>
                        <div className="relative">
                          <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                          >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {dropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'} ring-1 ring-black ring-opacity-5 z-10`}>
                              <button
                                onClick={() => handleDownloadQR(uploadedFile.shareUrl)}
                                className={`block w-full text-left px-4 py-3 text-base ${isDarkMode ? 'text-slate-300 hover:bg-slate-600' : 'text-slate-700 hover:bg-slate-100'}`}
                              >
                                <Download className="h-5 w-5 inline mr-2" /> Download QR
                              </button>
                              <button
                                onClick={() => handleCopyUrl(uploadedFile.shareUrl)}
                                className={`block w-full text-left px-4 py-3 text-base ${isDarkMode ? 'text-slate-300 hover:bg-slate-600' : 'text-slate-700 hover:bg-slate-100'}`}
                              >
                                <Copy className="h-5 w-5 inline mr-2" /> Copy URL
                              </button>
                              <button
                                onClick={handleDelete}
                                className={`block w-full text-left px-4 py-3 text-base ${isDarkMode ? 'text-red-400 hover:bg-slate-600' : 'text-red-600 hover:bg-slate-100'}`}
                              >
                                <Trash2 className="h-5 w-5 inline mr-2" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                        {uploadedFile && (
                          <div ref={qrCodeRef} style={{ position: 'absolute', left: '-9999px' }}>
                            <QRCode value={uploadedFile.shareUrl} />
                          </div>
                        )}
                      </td>
                      <td className={`border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} px-4 py-4`}>
                        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                          <FacebookShareButton url={uploadedFile.shareUrl} className="flex items-center">
                            <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                          </FacebookShareButton>
                          <TwitterShareButton url={uploadedFile.shareUrl} className="flex items-center">
                            <svg className="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                          </TwitterShareButton>
                          <WhatsappShareButton url={uploadedFile.shareUrl} className="flex items-center">
                            <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.297-.347.446-.52.149-.174.297-.347.397-.496.099-.149.099-.347-.002-.496-.099-.149-.397-.863-.67-1.162-.273-.297-.595-.297-.892-.198-.297.099-1.255.446-1.955 1.164-.693.693-.743 1.611-.644 2.059.099.446.892 2.059 2.178 3.023.992.743 2.228 1.164 3.767 1.362.495.099.892.099 1.29-.099.397-.198 1.29-.966 1.487-1.362.198-.397.198-.744.099-.892-.099-.149-.297-.347-.595-.496zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                          </WhatsappShareButton>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className={`py-2 px-6 text-base font-medium rounded-lg border ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
              >
                Upload Another File
              </button>
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