// utils/generatePasscode.js
const config = require('../config/config');

const generatePasscode = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let passcode = '';
  
  for (let i = 0; i < config.passcodeLength; i++) {
    passcode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return passcode;
};

module.exports = generatePasscode;