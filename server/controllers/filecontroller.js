// controllers/fileController.js
const shortid = require('shortid');
const { getGFS } = require('../config/db');
const qr = require('qr-image');

const uploadFile = (req, res) => {
  const file = req.file;
  const fileId = shortid.generate();
  const downloadLink = `${process.env.BASE_URL}/api/files/download/${file.filename}`;

  // Optional: store mapping in MongoDB if you want analytics
  res.json({
    fileName: file.originalname,
    link: downloadLink,
    qr: `${process.env.BASE_URL}/api/files/qr/${file.filename}`
  });
};

const downloadFile = (req, res) => {
  const gfs = getGFS();
  const file = req.params.filename;

  gfs.files.findOne({ filename: file }, (err, fileData) => {
    if (!fileData || fileData.length === 0) {
      return res.status(404).json({ msg: 'File not found' });
    }
    const readStream = gfs.createReadStream(fileData.filename);
    readStream.pipe(res);
  });
};

const generateQR = (req, res) => {
  const fileURL = `${process.env.BASE_URL}/api/files/download/${req.params.filename}`;
  const qr_svg = qr.image(fileURL, { type: 'png' });
  res.type('png');
  qr_svg.pipe(res);
};

module.exports = { uploadFile, downloadFile, generateQR };
