const express = require('express');
const cors = require('cors');
const path = require('path');
const menuItems = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));

// API route
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
