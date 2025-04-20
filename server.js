const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');
const multer = require('multer');
const menuItems = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public/images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// GET route
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// POST route with file upload
app.post('/api/menu', upload.single('image'), (req, res) => {
  const { name, description, price } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ success: false, message: 'Image file is required' });
  }

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required()
  });

  const result = schema.validate({ name, description, price });

  if (result.error) {
    return res.status(400).json({ success: false, message: result.error.details[0].message });
  }

  const newItem = {
    name,
    description,
    price: parseFloat(price),  
    image: `/images/${imageFile.filename}` 
  };

  menuItems.push(newItem);
  res.status(200).json({ success: true, message: 'Menu item added successfully!', item: newItem });
});

// PUT route to update a menu item
app.put('/api/menu/:index', upload.single('image'), (req, res) => {
  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0 || index >= menuItems.length) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const { name, description, price } = req.body;
  const imageFile = req.file;

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required()
  });

  const result = schema.validate({ name, description, price });

  if (result.error) {
    return res.status(400).json({ success: false, message: result.error.details[0].message });
  }

  const updatedItem = {
    name,
    description,
    price: parseFloat(price),
    image: imageFile ? `/images/${imageFile.filename}` : menuItems[index].image
  };

  menuItems[index] = updatedItem;

  res.status(200).json({ success: true, message: 'Item updated successfully!', item: updatedItem });
});

// DELETE route to remove a menu item
app.delete('/api/menu/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0 || index >= menuItems.length) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  menuItems.splice(index, 1);
  res.status(200).json({ success: true, message: 'Item deleted successfully!' });
});

//  Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
