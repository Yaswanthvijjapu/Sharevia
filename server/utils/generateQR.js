const QRCode = require('qrcode');

const generateQRCode = async (url) => {
  try {
    const qrCode = await QRCode.toDataURL(url);
    return qrCode;
  } catch (err) {
    throw new Error('QR code generation failed');
  }
};

module.exports = generateQRCode;