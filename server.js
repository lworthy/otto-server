require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');
const multer = require('multer');
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" Connected to MongoDB"))
.catch((err) => console.error(" MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer config
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


//  GET route - MongoDB

app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json({ success: true, menu: items });
  } catch (err) {
    console.error(" Error fetching menu items:", err); 
    res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
  }
});



//  POST route - MongoDB
app.post('/api/menu', upload.single('image'), async (req, res) => {
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

  try {
    const newItem = new MenuItem({
      name,
      description,
      price: parseFloat(price),
      image: `https://otto-server-g8hy.onrender.com/images/${imageFile.filename}`
    });

    await newItem.save();
    res.status(200).json({ success: true, message: 'Menu item added successfully!', item: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save item to database.' });
  }
});


// Legacy PUT route 
app.put('/api/menu/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
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

  try {
    const updateData = {
      name,
      description,
      price: parseFloat(price),
    };

    if (imageFile) {
      updateData.image = `https://otto-server-g8hy.onrender.com/images/${imageFile.filename}`;
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, message: 'Item updated successfully!', item: updatedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update item.' });
  }
});


// Legacy DELETE route 
app.delete('/api/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, message: 'Item deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete item.' });
  }
});


// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
