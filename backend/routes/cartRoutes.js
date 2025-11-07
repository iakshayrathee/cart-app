const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  processCheckout
} = require('../controllers/cartController');

const router = express.Router();

// GET /api/cart - Get cart with total
router.get('/', getCart);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', removeFromCart);

// PATCH /api/cart/:id - Update cart item quantity
router.patch('/:id', updateQuantity);

// POST /api/checkout - Process checkout
router.post('/checkout', processCheckout);

module.exports = router;