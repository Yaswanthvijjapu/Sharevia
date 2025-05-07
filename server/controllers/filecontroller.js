import 'dotenv/config';
import mongoose from 'mongoose';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import { randomBytes } from 'crypto';
import path from 'path';
import File from '../models/file.js';
import { StatusCodes } from 'http-status-codes';

// Validate MONGO_URI
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env file');
}

// Initialize GridFSBucket
let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'Uploads',
  });
});

// Configure storage
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'Uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

// Initialize upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Upload a file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' });
    }

    const expiryDays = parseInt(req.body.expiryDays) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size,
      expiresAt,
      user: req.user ? req.user.id : null,
    });

    await file.save();

    res.status(StatusCodes.CREATED).json(file);
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
    const files = await File.find(query).sort({ createdAt: -1 });
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
    return res.status(400).json({ message: 'Invalid file ID format' });
  }
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
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

    file.downloadCount += 1;
    await file.save();

    res.set('Content-Type', file.mimetype);
    res.set('Content-Disposition', `attachment; filename="${file.originalname}"`);

    if (!gfs) {
      throw new Error('GridFS not initialized');
    }

    const downloadStream = gfs.openDownloadStreamByName(file.filename);
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Download stream error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error streaming file' });
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
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
    }
    if (req.user && file.user && file.user.toString() !== req.user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized to delete this file' });
    }

    const files = await mongoose.connection.db.collection('Uploads.files').findOne({ filename: file.filename });
    if (!files) {
      throw new Error('GridFS file not found');
    }

    await gfs.delete(files._id);
    await File.deleteOne({ _id: req.params.id });

    res.status(StatusCodes.OK).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    if (error.kind === 'ObjectId' || error.message === 'GridFS file not found') {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found' });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};