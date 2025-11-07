import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ShoppingCart, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { addToCart } = useCart();

  useEffect(() => {
    const isInitialLoad = !products.length && loading;
    
    if (isInitialLoad) {
      fetchProducts();
    }
    
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialLoad) {
        fetchProducts(1); // Always reset to page 1 when filters change
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      // Show loading state only for initial load or filter changes
      if (page === 1) {
        setLoading(true);
      } else {
        setGridLoading(true);
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        sortOrder,
        search: searchTerm,
        category: selectedCategory
      });

      const response = await axios.get(`http://localhost:5000/api/products?${params}`);
      console.log('Fetched products:', response.data);
      
      // Add a small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setProducts(response.data.products);
      setPagination(response.data.pagination || {});
      setFilters(response.data.filters || {});
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setGridLoading(false);
    }
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleAddToCart = useCallback(async (productId, productName) => {
    try {
      await addToCart(productId, 1, productName);
      // Show success feedback (could be enhanced with toast notifications)
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  }, [addToCart]);

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
        <button
          onClick={fetchProducts}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  // Get unique categories for filter dropdown - ensure we get all categories from backend
  const categories = [...new Set([
    ...products.map(product => product.category).filter(Boolean),
    ...(filters.categories || [])
  ])];

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h2>
        <p className="text-gray-600">Discover amazing products at great prices</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md mx-auto px-4 sm:px-0">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
            <button
              onClick={() => handleSortChange('name')}
              className="flex items-center space-x-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
            >
              <span className="hidden xs:inline">Name</span>
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => handleSortChange('price')}
              className="flex items-center space-x-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
            >
              <span className="hidden xs:inline">Price</span>
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 min-h-[400px] relative px-4 sm:px-0">
        {gridLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        )}
        {products.map((product, index) => (
          <div 
            key={product._id} 
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-teal-500 animate-fade-in-up flex flex-col"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="relative overflow-hidden flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWpnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Yzk5Y2EiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  e.target.className = 'h-32 sm:h-40 md:h-48 w-full object-contain object-center bg-gray-100 p-4 sm:p-6 md:p-8';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
            </div>
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">{product.name}</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">{product.description}</p>
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">${product.price}</span>
                {product.category && (
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full hidden xs:inline">{product.category}</span>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product._id, product.name)}
                className="w-full px-4 sm:px-6 md:px-8 py-1 sm:py-2 rounded-md bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500 flex items-center justify-center space-x-1 sm:space-x-2 mt-auto text-xs sm:text-sm"
              >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 mt-6 sm:mt-8 px-4 sm:px-0">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center space-x-1 text-xs sm:text-sm"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Previous</span>
          </button>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg border text-xs sm:text-sm ${
                  page === pagination.currentPage
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'border-gray-300 hover:bg-gray-50'
                } transition-colors`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center space-x-1 text-xs sm:text-sm"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Check back later for new products</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;