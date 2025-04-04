const express = require('express');
const path = require('path');
const menuItems = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
