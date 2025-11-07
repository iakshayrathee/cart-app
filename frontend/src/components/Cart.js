import React from 'react';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, loading, error, removeFromCart, updateQuantity } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error}</div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h2>
        <p className="text-gray-600">Review your items before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Cart Items ({cart.items.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cart.items.map((item, index) => (
                <div 
                  key={item._id} 
                  className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.productId?.image}
                        alt={item.productId?.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGR5PSIuMzVlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljOTljYSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                          e.target.className = 'w-full h-full object-contain p-1 sm:p-2 bg-gray-100';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {item.productId?.name || 'Product'}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                        ${item.price} each
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-0.5 sm:space-x-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-0.5 sm:p-1 rounded-md hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        
                        <span className="w-6 sm:w-8 text-center font-medium text-xs sm:text-sm">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-0.5 sm:p-1 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Order Summary</h3>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                <span className="font-medium text-sm sm:text-base">${cart.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Tax (8%)</span>
                <span className="font-medium text-sm sm:text-base">${(cart.total * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-2 sm:pt-3">
                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${(cart.total * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => window.setActiveTab && window.setActiveTab('checkout')}
              className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-sm sm:text-base"
            >
              Proceed to Checkout
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
              Taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;