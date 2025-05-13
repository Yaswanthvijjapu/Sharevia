
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import File from '../models/file.js';

// Multer configuration
const allowedMimeTypes = [
  'application/pdf', // .pdf
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/json', // .json
  'video/mp4', // .mp4
  'video/x-msvideo', // .avi
  'video/x-matroska', // .mkv
  'video/quicktime', // .mov
  'video/webm', // .webm
  'text/plain', // .txt
  'image/png', // .png
  'image/jpeg', // .jpg, .jpeg
  'image/gif', // .gif
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, DOCX, JSON, MP4, AVI, MKV, MOV, WEBM, TXT, PNG, JPG'), false);
    }
  },
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const { expiryDays } = req.body;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays || '7'));

    const file = new File({
      path: req.file.filename,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      uniqueId: uuidv4(),
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      shareUrl: `${req.protocol}://${req.get('host')}/file/${uuidv4()}`,
      user: null, // Set to req.user.id if authentication is implemented
    });

    await file.save();
    res.json({ data: file });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({});
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id); // Or findOne({ uniqueId: req.params.id })
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    const filePath = path.join(process.cwd(), 'Uploads', file.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    res.setHeader('Content-Type', file.type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Length', file.size);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    const filePath = path.join(process.cwd(), 'Uploads', file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete file from disk
    }
    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};