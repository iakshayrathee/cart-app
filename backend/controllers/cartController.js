const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart with total
const getCart = async (req, res) => {
  try {
    const { sessionId = 'default-session' } = req.query;
    
    const cart = await Cart.findOne({ sessionId }).populate('items.productId');
    
    if (!cart) {
      return res.json({ items: [], total: 0, sessionId });
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, sessionId = 'default-session' } = req.body;
    
    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid productId or quantity' });
    }
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }
    
    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await cart.save();
    
    // Populate product details for response
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    
    res.json(populatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId = 'default-session' } = req.body;
    
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Find the item index to remove
    const itemIndex = cart.items.findIndex(item => item._id.toString() === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    // Remove the item
    cart.items.splice(itemIndex, 1);
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    
    res.json(populatedCart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Update cart item quantity
const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, sessionId = 'default-session' } = req.body;
    
    // Validate input
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Find the item to update
    const itemIndex = cart.items.findIndex(item => item._id.toString() === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    
    res.json(populatedCart);
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
};

// Process checkout
const processCheckout = async (req, res) => {
  try {
    const { sessionId = 'default-session', customerInfo } = req.body;
    
    const cart = await Cart.findOne({ sessionId }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Create receipt
    const receipt = {
      orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date(),
      items: cart.items,
      total: cart.total,
      customerInfo: customerInfo || {},
      tax: cart.total * 0.08, // 8% tax
      grandTotal: cart.total * 1.08
    };
    
    // Clear cart after successful checkout
    cart.items = [];
    cart.total = 0;
    await cart.save();
    
    res.json(receipt);
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  processCheckout
};