// utils/generateQR.js
const QRCode = require('qrcode');

const generateQR = async (data) => {
  try {
    // Generate QR code as base64 string
    const qrCode = await QRCode.toDataURL(data);
    return qrCode;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = generateQR;
