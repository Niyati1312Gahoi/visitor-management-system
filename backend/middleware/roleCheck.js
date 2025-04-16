// middleware/roleCheck.js
const roleCheck = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ msg: 'No authorization token provided' });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied: Insufficient permissions' });
      }
      
      next();
    };
  };
  
  module.exports = roleCheck;