const mongoose = require('mongoose');
const { getGfs } = require('../config/db');
const generateQRCode = require('../utils/generateQR');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileId = req.file.id;
    const shareLink = `${req.protocol}://${req.get('host')}/api/files/${fileId}`;
    res.json({ fileId, shareLink });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

const getFile = async (req, res) => {
  try {
    const file = await mongoose.connection.db.collection('uploads.files').findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const gfs = getGfs();
    const downloadStream = gfs.openDownloadStream(file._id);
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getQRCode = async (req, res) => {
  try {
    const shareLink = `${req.protocol}://${req.get('host')}/api/files/${req.params.id}`;
    const qrCode = await generateQRCode(shareLink);
    res.json({ qrCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadFile, getFile, getQRCode };