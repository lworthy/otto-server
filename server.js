const express = require('express');
const cors = require('cors');
const path = require('path');
const Joi = require('joi');
const menuItems = require('./data');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3001;

// GET
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// POST
app.post('/api/menu', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(5).required(),
    price: Joi.number().positive().required(),
    image: Joi.string().uri().required()
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).json({ success: false, message: result.error.details[0].message });
  }

  menuItems.push(req.body);
  res.json({ success: true, message: 'Menu item added successfully!' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
