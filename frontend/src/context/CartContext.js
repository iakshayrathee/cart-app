import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

// Cart actions
const cartActions = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  SET_ERROR: 'SET_ERROR',
  CLEAR_CART: 'CLEAR_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case cartActions.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case cartActions.SET_CART:
      return { ...state, cart: action.payload, loading: false };
    
    case cartActions.ADD_ITEM:
      return { ...state, cart: action.payload, loading: false };
    
    case cartActions.REMOVE_ITEM:
      return { ...state, cart: action.payload, loading: false };
    
    case cartActions.UPDATE_QUANTITY:
      return { ...state, cart: action.payload, loading: false };
    
    case cartActions.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case cartActions.CLEAR_CART:
      return { ...state, cart: { items: [], total: 0 }, loading: false };
    
    default:
      return state;
  }
};

const initialState = {
  cart: { items: [], total: 0 },
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      console.time('fetchCart');
      console.log('🛒 Starting cart fetch operation...');
      dispatch({ type: cartActions.SET_LOADING, payload: true });
      
      const startTime = performance.now();
      const response = await axios.get(`${API_BASE_URL}/cart`);
      const endTime = performance.now();
      
      console.log(`⏱️ Cart API call took ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`📦 Cart response data:`, response.data);
      
      // Handle case where cart might not exist yet
      if (response.data && (response.data.items || response.data.items === [])) {
        console.log(`✅ Cart loaded successfully with ${response.data.items?.length || 0} items`);
        dispatch({ type: cartActions.SET_CART, payload: response.data });
      } else {
        // If no cart exists, set empty cart
        console.log('ℹ️ No cart found, setting empty cart');
        dispatch({ type: cartActions.SET_CART, payload: { items: [], total: 0 } });
      }
      
      console.timeEnd('fetchCart');
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      console.log('⚠️ Setting empty cart due to error');
      // If error occurs, set empty cart instead of showing error
      dispatch({ type: cartActions.SET_CART, payload: { items: [], total: 0 } });
    }
  };

  const addToCart = async (productId, quantity = 1, productName = 'item') => {
    try {
      console.time('addToCart');
      console.log(`➕ Adding ${quantity} of product ${productId} to cart...`);
      dispatch({ type: cartActions.SET_LOADING, payload: true });
      
      const startTime = performance.now();
      const response = await axios.post(`${API_BASE_URL}/cart`, {
        productId,
        quantity,
        sessionId: 'default-session'
      });
      const endTime = performance.now();
      
      console.log(`⏱️ Add to cart API call took ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`✅ Added item successfully:`, response.data);
      dispatch({ type: cartActions.ADD_ITEM, payload: response.data });
      
      toast.success(`Added ${productName} to cart!`);
      console.timeEnd('addToCart');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      dispatch({ 
        type: cartActions.SET_ERROR, 
        payload: 'Failed to add item to cart' 
      });
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      console.time('removeFromCart');
      console.log(`🗑️ Removing item ${itemId} from cart...`);
      dispatch({ type: cartActions.SET_LOADING, payload: true });
      
      // Get item details before removal for toast notification
      const item = state.cart.items.find(item => item._id === itemId);
      
      const startTime = performance.now();
      const response = await axios.delete(`${API_BASE_URL}/cart/${itemId}`, {
        data: { sessionId: 'default-session' }
      });
      const endTime = performance.now();
      
      console.log(`⏱️ Remove from cart API call took ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`✅ Removed item successfully:`, response.data);
      dispatch({ type: cartActions.REMOVE_ITEM, payload: response.data });
      
      toast.success(`Removed ${item?.productId?.name || 'item'} from cart`);
      console.timeEnd('removeFromCart');
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      dispatch({ 
        type: cartActions.SET_ERROR, 
        payload: 'Failed to remove item from cart' 
      });
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    console.time('updateQuantity');
    console.log(`🔄 Updating quantity for item ${itemId} to ${newQuantity}...`);
    
    if (newQuantity < 1) {
      console.log('📉 Quantity below 1, removing item instead');
      await removeFromCart(itemId);
      console.timeEnd('updateQuantity');
      return;
    }

    try {
      dispatch({ type: cartActions.SET_LOADING, payload: true });
      
      // First get the item details for toast notification
      const item = state.cart.items.find(item => item._id === itemId);
      if (!item) {
        console.log('⚠️ Item not found for quantity update');
        console.timeEnd('updateQuantity');
        return;
      }

      console.log(`🔄 Processing quantity update for: ${item?.productId?.name || 'item'}`);
      
      const startTime = performance.now();
      
      // Use PATCH endpoint for single API call
      const response = await axios.patch(`${API_BASE_URL}/cart/${itemId}`, {
        quantity: newQuantity,
        sessionId: 'default-session'
      });
      
      const endTime = performance.now();
      
      console.log(`⏱️ Quantity update API call took ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`✅ Quantity updated successfully:`, response.data);
      dispatch({ type: cartActions.UPDATE_QUANTITY, payload: response.data });
      
      toast.success(`Updated ${item?.productId?.name || 'item'} quantity to ${newQuantity}`);
      console.timeEnd('updateQuantity');
    } catch (error) {
      console.error('❌ Error updating quantity:', error);
      dispatch({ 
        type: cartActions.SET_ERROR, 
        payload: 'Failed to update quantity' 
      });
      toast.error('Failed to update quantity');
      console.timeEnd('updateQuantity');
    }
  };

  const clearCart = () => {
    dispatch({ type: cartActions.CLEAR_CART });
  };

  const value = {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;