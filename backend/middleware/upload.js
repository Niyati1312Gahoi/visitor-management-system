// middleware/upload.js
const multer = require('multer');
const path = require('path');
const config = require('../config/config');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, config.photoUploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allow only image files
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB max size
  fileFilter: fileFilter
});

module.exports = upload;