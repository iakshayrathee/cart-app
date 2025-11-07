const express = require('express');
const {
  getProducts,
  getFakeStoreProducts,
  syncProducts
} = require('../controllers/productController');

const router = express.Router();

// GET /api/products - Get all products from database
router.get('/', getProducts);

// GET /api/products/fake-store - Get products from Fake Store API
router.get('/fake-store', getFakeStoreProducts);

// POST /api/products/sync - Sync products from Fake Store API to database
router.post('/sync', syncProducts);

module.exports = router;