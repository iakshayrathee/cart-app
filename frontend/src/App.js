import React, { useState } from 'react';
import { ShoppingCart, Package, CreditCard, User } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { CartProvider, useCart } from './context/CartContext';

// Separate Header component to prevent re-renders
const Header = React.memo(({ activeTab, setActiveTab, cartItemCount }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Vibe Commerce</h1>
        </div>
        
        <nav className="flex space-x-1 sm:space-x-2">
          {[
            { id: 'products', label: 'Products', icon: Package, shortLabel: 'Shop' },
            { 
              id: 'cart', 
              label: 'Cart', 
              shortLabel: 'Cart',
              icon: ShoppingCart,
              badge: cartItemCount > 0 ? cartItemCount : null
            },
            { id: 'checkout', label: 'Checkout', icon: CreditCard, shortLabel: 'Pay' },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-2 py-2 rounded-md text-xs font-medium transition-colors duration-200 relative ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  </header>
));

// Separate Footer component
const Footer = React.memo(() => (
  <footer className="bg-gray-800 text-white py-4 text-center mt-auto">
    <p>&copy; 2025 E-Commerce Store. All rights reserved.</p>
  </footer>
));

function App() {
  const [activeTab, setActiveTab] = useState('products');

  // Expose setActiveTab to window for navigation from Cart component
  React.useEffect(() => {
    window.setActiveTab = setActiveTab;
    return () => {
      window.setActiveTab = null;
    };
  }, [setActiveTab]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              maxWidth: '90vw',
              margin: '0 auto',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Header - Memoized to prevent re-renders */}
        <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <HeaderWithCartCount activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {activeTab === 'products' && <ProductGrid />}
          {activeTab === 'cart' && <Cart />}
          {activeTab === 'checkout' && <Checkout />}
        </main>

        {/* Footer - Memoized to prevent re-renders */}
        <Footer />
      </div>
    </CartProvider>
  );
}

// Separate component to use the useCart hook
const HeaderWithCartCount = ({ activeTab, setActiveTab }) => {
  const { cart } = useCart();
  return (
    <Header 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      cartItemCount={cart.items.length} 
    />
  );
};

export default App;