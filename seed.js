require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected for seeding!');

  const items = [
    {
      name: "SH Burger",
      description: "Juicy beef patty with smoky bacon, melted cheddar, crispy fried onions, and house-made BBQ sauce.",
      price: 16,
      image: "/images/burger.jpg"
    },
    {
      name: "Specialty Pasta",
      description: "Creamy garlic parmesan pasta with grilled chicken and sun-dried tomatoes, topped with fresh basil.",
      price: 18,
      image: "/images/pasta.jpg"
    },
    {
      name: "Classic Cheesecake",
      description: "Rich and creamy cheesecake with a buttery graham cracker crust, topped with fresh strawberries.",
      price: 8,
      image: "/images/cheesecake.jpg"
    },
    {
      name: "Garden Fresh Salad",
      description: "Crisp greens with tomatoes, cucumbers, carrots, and balsamic vinaigrette.",
      price: 12,
      image: "/images/salad.jpg"
    },
    {
      name: "Signature Pizza",
      description: "Hand-stretched artisan crust with zesty tomato sauce, premium cheeses, and gourmet toppings.",
      price: 17,
      image: "/images/pizza.jpg"
    },
    {
      name: "House Lemonade",
      description: "Refreshing homemade lemonade with freshly squeezed lemons and a hint of mint.",
      price: 3,
      image: "/images/lemonade.jpg"
    },
    {
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon grilled to perfection, served with lemon-butter sauce and seasonal vegetables.",
      price: 24,
      image: "/images/salmon.jpg"
    },
    {
      name: "Iced Caramel Macchiato",
      description: "Espresso layered with vanilla, milk, and caramel drizzle over ice.",
      price: 6,
      image: "/images/macchiato.jpg"
    }
  ];

  await MenuItem.deleteMany(); // Optional: clear old items
  await MenuItem.insertMany(items);
  console.log(' Seed data inserted!');
  process.exit(); // Exit after finishing
})
.catch(err => {
  console.error(' Seed error:', err);
  process.exit(1);
});
