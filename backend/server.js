// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); // Import path module
require('dotenv').config();

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visitor', require('./routes/visitor'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/photo', require('./routes/photo'));
app.use('/api/setup', require('./routes/setup'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));