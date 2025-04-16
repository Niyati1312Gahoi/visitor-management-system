// config/config.js
module.exports = {
    jwtSecret: process.env.JWT_SECRET || f000d5e9c548802e2a7759012c4012cfe9ca58235926cd2090f704dc495c716e
    ,
    jwtExpiration: '24h',
    passcodeLength: 6,
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
    photoUploadPath: './uploads/photos'
  };
  