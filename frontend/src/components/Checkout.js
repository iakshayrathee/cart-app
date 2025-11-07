import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { CreditCard, User, Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';


const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Basic validation
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/cart/checkout', {
        sessionId: 'default-session',
        customerInfo
      });

      setReceipt(response.data);
      clearCart();
    } catch (err) {
      setError('Checkout failed. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation and Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg animate-pulse">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">Thank you for your purchase. Your order has been processed successfully.</p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 sm:p-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Order Receipt</h3>
                <p className="text-green-100 text-xs sm:text-sm">Order #: {receipt.orderId}</p>
              </div>
            </div>
          </div>
          
          {/* Receipt Content */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* Order Timeline */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-blue-800 text-sm sm:text-base">Order Timeline</span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Order Date:</span>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm">
                    {new Date(receipt.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Order Time:</span>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm">
                    {new Date(receipt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center space-x-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-sm sm:text-base">Customer Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 rounded-xl p-4 sm:p-6">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{receipt.customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{receipt.customerInfo.email}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Shipping Address</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{receipt.customerInfo.address}</p>
                </div>
                {receipt.customerInfo.phone && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{receipt.customerInfo.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-sm sm:text-base">Order Items ({receipt.items.length})</span>
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {receipt.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {item.quantity} x {item.productId?.name || 'Item'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">SKU: {item.productId?._id || 'N/A'}</p>
                    </div>
                    <span className="font-semibold text-green-600 text-sm sm:text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 sm:p-6">
              <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Order Summary</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs sm:text-sm">Subtotal:</span>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm">${receipt.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs sm:text-sm">Tax (8%):</span>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm">${receipt.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 sm:pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-lg sm:text-xl font-bold text-green-600">${receipt.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2 text-sm sm:text-base">Thank you for shopping with Vibe Commerce!</p>
              <p className="text-xs sm:text-sm text-gray-500">
                A confirmation email has been sent to {receipt.customerInfo.email}
              </p>
              <button 
                onClick={() => window.setActiveTab && window.setActiveTab('products')}
                className="mt-3 sm:mt-4 px-4 sm:px-6 py-1 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CreditCard className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Secure Checkout
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Complete your purchase with confidence - your information is protected</p>
        
        {/* Enhanced Checkout Progress */}
        <div className="flex justify-center mb-12 mt-10">
          <div className="flex items-center bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Cart</p>
                <p className="text-xs text-gray-500">Review items</p>
              </div>
            </div>
            
            <div className="w-12 h-0.5 bg-blue-600 mx-6"></div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Information</p>
                <p className="text-xs text-gray-500">Enter details</p>
              </div>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300 mx-6"></div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <span className="text-gray-600 text-sm font-bold">3</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Review</p>
                <p className="text-xs text-gray-400">Confirm order</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cart.items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some amazing products to proceed with checkout</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Customer Information</h3>
                    <p className="text-blue-100 text-sm">Secure & encrypted - we protect your data</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 p-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-blue-600 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-blue-600 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Shipping Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-blue-600 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                      placeholder="123 Main St, City, State, ZIP"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-blue-600 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Order Summary</h3>
                    <p className="text-gray-200 text-sm">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 p-8">
                {/* Cart Items */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Items</h4>
                  {cart.items.map((item, index) => (
                    <div key={item._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.productId?.name || 'Product'}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-xs text-gray-500">
                            ${item.price} each
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-blue-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Order Total</h4>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${cart.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium text-gray-900">${(cart.total * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      ${(cart.total * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-blue-800 text-sm font-medium">Secure Checkout</p>
                      <p className="text-blue-600 text-xs">
                        This is a mock transaction. Your information is protected and no real payment will be processed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;