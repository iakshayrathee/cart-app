# Vibe Commerce - Full Stack Shopping Cart

A comprehensive, modern e-commerce shopping cart application built with the MERN stack. Features advanced product browsing, real-time cart management, and a complete checkout workflow with Fake Store API integration.

## 🚀 Features

### Backend (Node.js/Express + MongoDB)
- **RESTful API** with complete CRUD operations and pagination
- **MongoDB integration** with Mongoose ODM for data persistence
- **Fake Store API integration** with automatic product synchronization
- **Session-based cart management** with persistent storage
- **Advanced product filtering** (search, category, sorting, pagination)
- **Checkout system** with tax calculation and receipt generation
- **Comprehensive error handling** with proper HTTP status codes
- **Database seeding** with mock data fallback

### Frontend (React + Tailwind CSS)
- **Modern responsive UI** with Tailwind CSS and custom animations
- **React Context API** for global state management
- **Real-time cart updates** with optimistic UI
- **Product grid** with search, filter, and sorting capabilities
- **Shopping cart** with quantity management and total calculation
- **Checkout form** with customer information validation
- **Order receipt** generation with detailed breakdown
- **Loading states** and error handling throughout
- **Mobile-first responsive design** for all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React

## 📦 API Endpoints

### Products API
| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/products` | Get all products with filtering | `page`, `limit`, `search`, `category`, `sortBy`, `sortOrder` |
| GET | `/api/products/fake-store` | Get products directly from Fake Store API | - |
| POST | `/api/products/sync` | Sync products from Fake Store API to database | - |

### Cart API
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| GET | `/api/cart` | Get cart contents | `sessionId` (query param) |
| POST | `/api/cart` | Add item to cart | `productId`, `quantity`, `sessionId` |
| DELETE | `/api/cart/:id` | Remove item from cart | `sessionId` |
| PATCH | `/api/cart/:id` | Update item quantity | `quantity`, `sessionId` |
| POST | `/api/checkout` | Process checkout | `sessionId`, `customerInfo` |

### Utility Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/` | API information and documentation |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iakshayrathee/cart-app
   cd vibe-commerce
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file 
   "PORT=5000"
   "MONGODB_URI=<YOUR_MONGODB_URI>"
   
   # Start MongoDB (make sure MongoDB is running)
   # On Windows: net start MongoDB
   # On macOS: brew services start mongodb-community
   
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Complete Project Structure

```
vibe-commerce/
├── backend/                          # Node.js Express Backend
│   ├── config/                       # Configuration files
│   │   └── database.js               # MongoDB connection configuration
│   ├── controllers/                  # Route controllers (business logic)
│   │   ├── cartController.js         # Cart operations (add, remove, update, checkout)
│   │   └── productController.js      # Product operations (fetch, sync, filter)
│   ├── middleware/                   # Custom middleware (authentication, validation)
│   ├── models/                       # MongoDB Mongoose models
│   │   ├── Cart.js                   # Cart schema with session-based items
│   │   └── Product.js                # Product schema with ratings and categories
│   ├── routes/                       # API route definitions
│   │   ├── cartRoutes.js             # Cart-related endpoints
│   │   └── productRoutes.js           # Product-related endpoints
│   ├── scripts/                      # Utility scripts
│   │   └── seedDatabase.js           # Database seeding script
│   ├── utils/                        # Utility functions and helpers
│   ├── .env                         # Environment variables
│   ├── package.json                  # Backend dependencies
│   ├── package-lock.json             # Dependency lock file
│   └── server.js                     # Express server entry point
├── frontend/                         # React Frontend
│   ├── public/                       # Static assets
│   │   └── index.html               # HTML template
│   ├── src/                          # React source code
│   │   ├── components/               # Reusable React components
│   │   │   ├── Cart.js              # Shopping cart component
│   │   │   ├── Checkout.js          # Checkout form component
│   │   │   └── ProductGrid.js       # Product grid with filtering
│   │   ├── context/                  # React Context providers
│   │   │   └── CartContext.js        # Global cart state management
│   │   ├── lib/                      # Utility libraries
│   │   │   └── utils.js              # Helper functions
│   │   ├── ui/                       # UI components
│   │   │   └── card-hover-effect.js  # Custom UI effects
│   │   ├── App.js                    # Main application component
│   │   ├── index.css                 # Global styles
│   │   └── index.js                  # React entry point
│   ├── package.json                   # Frontend dependencies
│   ├── package-lock.json              # Dependency lock file
│   ├── postcss.config.js              # PostCSS configuration
│   └── tailwind.config.js             # Tailwind CSS configuration
└── README.md                         # Project documentation
```

## 🎯 Complete Feature Implementation

### ✅ Core E-commerce Features
- [x] **Product Catalog**: Grid display with 20+ products from Fake Store API
- [x] **Advanced Filtering**: Search by name/description, filter by category, sort by price/name
- [x] **Pagination**: 12 products per page with navigation controls
- [x] **Shopping Cart**: Add/remove items with real-time quantity updates
- [x] **Cart Persistence**: Session-based cart storage in MongoDB
- [x] **Quantity Management**: Increase/decrease item quantities with validation
- [x] **Real-time Totals**: Automatic cart total calculation with tax
- [x] **Checkout Process**: Customer information form with validation
- [x] **Order Receipt**: Detailed receipt generation with order ID
- [x] **Responsive Design**: Mobile-first responsive layout

### ✅ Bonus Features Implemented
- [x] **Database Persistence**: Full MongoDB integration with Mongoose ODM
- [x] **Fake Store API Integration**: Real product data from external API
- [x] **Automatic Data Sync**: One-click product synchronization
- [x] **Comprehensive Error Handling**: Frontend and backend error management
- [x] **Modern UI/UX**: Tailwind CSS with custom animations and hover effects
- [x] **React Context API**: Global state management for cart
- [x] **RESTful API Design**: Clean, well-structured API endpoints
- [x] **Input Validation**: Both client-side and server-side validation
- [x] **Loading States**: Spinners and skeleton loaders throughout
- [x] **Session Management**: Persistent cart across browser sessions
- [x] **Fallback System**: Mock products when external API fails
- [x] **Health Checks**: API health monitoring endpoint
- [x] **CORS Configuration**: Proper cross-origin resource sharing

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient accents
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Smooth hover effects and transitions
- **Loading States**: Spinners and skeleton loaders
- **Error Handling**: User-friendly error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔧 Detailed API Documentation

### Products API

**GET /api/products** - Get paginated and filtered products
```javascript
// Request
GET /api/products?page=1&limit=12&search=phone&category=electronics&sortBy=price&sortOrder=desc

// Response
{
  "products": [
    {
      "_id": "67a1b2c3d4e5f67890123456",
      "name": "iPhone 15 Pro",
      "price": 999.99,
      "description": "Latest iPhone with advanced camera",
      "category": "electronics",
      "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      "rating": { "rate": 4.8, "count": 120 }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalProducts": 28,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "search": "phone",
    "category": "electronics",
    "sortBy": "price",
    "sortOrder": "desc"
  }
}
```

### Cart API

**POST /api/cart** - Add item to cart
```javascript
// Request
POST /api/cart
{
  "productId": "67a1b2c3d4e5f67890123456",
  "quantity": 2,
  "sessionId": "user-session-123"
}

// Response
{
  "_id": "cart_id_123",
  "sessionId": "user-session-123",
  "items": [
    {
      "_id": "item_id_456",
      "productId": {
        "_id": "67a1b2c3d4e5f67890123456",
        "name": "iPhone 15 Pro",
        "price": 999.99,
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
      },
      "quantity": 2,
      "price": 999.99
    }
  ],
  "total": 1999.98,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Checkout API

**POST /api/checkout** - Process order checkout
```javascript
// Request
POST /api/checkout
{
  "sessionId": "user-session-123",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, State 12345",
    "phone": "+1-555-0123"
  }
}

// Response
{
  "orderId": "ORD-9XK7P2Q1R",
  "timestamp": "2024-01-15T10:35:00.000Z",
  "items": [
    {
      "productId": {
        "_id": "67a1b2c3d4e5f67890123456",
        "name": "iPhone 15 Pro",
        "price": 999.99
      },
      "quantity": 2,
      "price": 999.99
    }
  ],
  "total": 1999.98,
  "tax": 159.9984,
  "grandTotal": 2159.9784,
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, State 12345",
    "phone": "+1-555-0123"
  }
}
```

## 🏗️ Architecture & Complete Working Flow

### Backend Architecture
- **Express.js Server**: RESTful API with middleware stack
- **MongoDB Database**: Persistent data storage with Mongoose ODM
- **Controller Pattern**: Separation of business logic from routes
- **Session Management**: Cookie-based session persistence
- **API Integration**: Real-time Fake Store API synchronization

### Frontend Architecture
- **React 18**: Functional components with hooks
- **Context API**: Global state management for cart
- **Tailwind CSS**: Utility-first styling with custom components
- **Axios**: HTTP client for API communication
- **Component Structure**: Modular, reusable components

### Data Flow
1. **Product Loading**: Server initializes with Fake Store API data
2. **User Interaction**: Frontend makes API calls to backend
3. **State Management**: React Context updates UI in real-time
4. **Persistence**: MongoDB stores cart and product data
5. **Checkout**: Order processing with receipt generation

### Session Management
- **Session ID**: Unique identifier for each user session
- **Cart Persistence**: Carts stored in database with session reference
- **Browser Storage**: Session maintained across page refreshes
- **Stateless Design**: Backend doesn't store session state

## 🧪 Testing & Error Handling

The application includes comprehensive testing and error handling:

### Backend Testing
- **Input Validation**: Schema validation for all API requests
- **Database Errors**: Connection failure handling and retries
- **API Integration**: Fake Store API fallback mechanisms
- **Edge Cases**: Empty cart, invalid quantities, product not found

### Frontend Testing
- **Form Validation**: Client-side validation for user inputs
- **Network Errors**: Graceful handling of API failures
- **Loading States**: Spinners and skeleton screens
- **Error Boundaries**: React error boundary implementation

### Error Recovery
- **Automatic Retry**: Failed API calls retry automatically
- **Fallback Data**: Mock products when external API fails
- **User Feedback**: Clear error messages and recovery options
- **Logging**: Comprehensive console logging for debugging

## 📸 Screenshots

### Products Page
![Products Page](./images/products-page.png)

### Cart Page
![Cart Page](./images/cart-page.png)

### Checkout Page
![Checkout Page](./images/checkout-page.png)

### Mobile Cart Page
![Mobile Cart Page](./images/mobile-cart-page.png)

- **Products Page**: Grid of products with add-to-cart buttons
- **Cart Page**: Items with quantities, prices, and totals
- **Checkout Page**: Customer form and order summary
- **Receipt Page**: Order confirmation with details

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use local MongoDB
2. Update environment variables for production
3. Deploy to Heroku, Vercel, or your preferred platform

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or similar platform
3. Update API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- User authentication and profiles
- Payment integration (Stripe, PayPal)
- Product search and filtering
- Order history and tracking
- Email notifications
- Admin dashboard
- Product reviews and ratings
- Wishlist functionality
- Inventory management

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

Built with ❤️ for Vibe Commerce Screening Assignment