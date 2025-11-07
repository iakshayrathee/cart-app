const mongoose = require('mongoose');
const axios = require('axios');
const Product = require('../models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Fetch products from Fake Store API
    console.log('Fetching products from Fake Store API...');
    const response = await axios.get('https://fakestoreapi.com/products');
    const fakeStoreProducts = response.data;
    
    // Transform to match our schema
    const productsToInsert = fakeStoreProducts.map(product => ({
      name: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating
    }));
    
    // Insert new products
    console.log('Inserting products into database...');
    await Product.insertMany(productsToInsert);
    
    console.log(`✅ Successfully seeded database with ${productsToInsert.length} products from Fake Store API`);
    
    // Display the inserted products
    const insertedProducts = await Product.find({});
    console.log('\nInserted Products:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.response) {
      console.error('Fake Store API response:', error.response.status, error.response.statusText);
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();