import 'dotenv/config';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import File from '../models/file.js';
import fs from 'fs/promises';
import { StatusCodes } from 'http-status-codes';

// Validate MONGODB_URL
if (!process.env.MONGO_URI) {
  throw new Error('MONGODB_URL is not defined in .env file');
}

// Configure storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Initialize upload middleware
// Initialize upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = [
      '.jpg', '.jpeg', '.webp', '.png',
      '.mp4', '.avi', '.mov', '.mkv', '.mk3d', '.mks', '.mka',
      '.pdf',
    ];
    if (!allowedExts.includes(ext)) {
      return cb(new Error(`Unsupported file type! ${ext}`), false);
    }
    cb(null, true);
  },
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' });
    }

    const expiryDaysInput = req.body.expiryDays;
    const expiryDays = (!isNaN(expiryDaysInput) && parseInt(expiryDaysInput) > 0) ? parseInt(expiryDaysInput) : 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const file = new File({
      path: req.file.path,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      expiresAt,
      user: req.user ? req.user.id : null,
    });

    await file.save();
    console.log('File saved to MongoDB:', file); // Debug log

    res.status(StatusCodes.CREATED).json({
      message: 'File uploaded successfully',
      path: `${process.env.SERVER_URL || 'http://localhost:5000'}/file/${file._id}`,
      data: file,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// Get all files for a user
export const getFiles = async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      query.user = req.user.id;
    }
    console.log('Querying files with:', query); // Debug log
    const files = await File.find(query).sort({ createdAt: -1 });
    console.log('Files found:', files); // Debug log
    res.status(StatusCodes.OK).json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// Get file details by ID
export const getFileById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid file ID format' });
  }
  try {
    const file = await File.findById(id);
    if (!file) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
    }
    // Optional: Check ownership
    if (file.user && req.user && file.user.toString() !== req.user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized to access this file' });
    }
    res.status(StatusCodes.OK).json(file);
  } catch (error) {
    console.error('Get file error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// Download a file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
    }
    if (new Date() > new Date(file.expiresAt)) {
      return res.status(StatusCodes.GONE).json({ message: 'File has expired' });
    }

    // Optional: Check ownership
    if (file.user && req.user && file.user.toString() !== req.user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized to download this file' });
    }

    file.downloadCount += 1;
    await file.save();

    res.download(file.path, file.name, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// Delete a file
export const deleteFile = async (req, res) => {
  try {
    console.log('Deleting file with ID:', req.params.id);
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
    }
    console.log('File found:', file);

    // Delete file from disk
    await fs.unlink(file.path).catch((err) => {
      if (err.code !== 'ENOENT') {
        console.error('Failed to delete file from disk:', err);
        throw err;
      }
    });
    console.log('File deleted from disk:', file.path);

    await File.deleteOne({ _id: req.params.id });
    console.log('File deleted from MongoDB:', req.params.id);

    res.status(StatusCodes.OK).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};