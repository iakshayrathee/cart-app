const Product = require('../models/Product');
const axios = require('axios');

// Mock products data (fallback)
const mockProducts = [
  { 
    name: 'Wireless Headphones', 
    price: 99.99, 
    description: 'Premium wireless headphones with noise cancellation', 
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
  },
  { 
    name: 'Smart Watch', 
    price: 199.99, 
    description: 'Feature-rich smartwatch with health monitoring', 
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
  }
];

// Get all products with pagination, sorting, searching, and filtering
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sortBy = 'name',
      sortOrder = 'asc',
      search = '',
      category = ''
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    // Get products with filters, sorting, and pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        search,
        category,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get products from Fake Store API
const getFakeStoreProducts = async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    const products = response.data.map(product => ({
      name: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating
    }));
    res.json(products);
  } catch (error) {
    console.error('Error fetching from Fake Store API:', error);
    res.status(500).json({ error: 'Failed to fetch products from Fake Store API' });
  }
};

// Sync products from Fake Store API to database
const syncProducts = async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    const fakeStoreProducts = response.data;
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    const productsToInsert = fakeStoreProducts.map(product => ({
      name: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating
    }));
    
    await Product.insertMany(productsToInsert);
    
    res.json({ message: 'Products synced successfully', count: productsToInsert.length });
  } catch (error) {
    console.error('Error syncing products:', error);
    res.status(500).json({ error: 'Failed to sync products' });
  }
};

// Initialize products from Fake Store API
const initializeProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      // Fetch products from Fake Store API
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
      
      await Product.insertMany(productsToInsert);
      console.log(`Products initialized from Fake Store API: ${productsToInsert.length} products`);
    } else {
      console.log(`Database already contains ${count} products`);
    }
  } catch (error) {
    console.error('Error initializing products from Fake Store API:', error);
    
    // Fallback to mock products if Fake Store API fails
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(mockProducts);
        console.log('Fallback: Mock products initialized');
      }
    } catch (fallbackError) {
      console.error('Error initializing fallback mock products:', fallbackError);
    }
  }
};

module.exports = {
  getProducts,
  getFakeStoreProducts,
  syncProducts,
  initializeProducts
};