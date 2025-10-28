# Admin Panel Setup Guide

## Overview

This admin panel allows you to manage products, categories, and orders for the Arte em Ponto e-commerce store. The panel includes:

- Dashboard with statistics
- Product management (CRUD operations)
- Order management with status updates
- Category management
- Authentication and authorization

## Architecture

### Backend (server/)
- Express.js with TypeScript
- Supabase for database and authentication
- RESTful API with admin authentication middleware
- Validation using express-validator

### Frontend (client/src/admin/)
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Protected routes with role-based access

## Installation

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Configuration (optional)
ADMIN_EMAIL=admin@example.com
```

### 2. Frontend Setup

Create a `.env` file in the `client/` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

You need to create the following tables in Supabase:

#### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_postal_code TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

#### Users Table (for admin role)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Create Admin User

1. Sign up a user through Supabase authentication
2. Add the user to the `users` table with role 'admin':

```sql
INSERT INTO users (id, email, role)
VALUES ('user-uuid-from-auth', 'admin@example.com', 'admin');
```

## Running the Application

### Development Mode

Start the backend server:
```bash
cd server
npm run dev
```

The server will run on `http://localhost:3001`

Start the frontend (in a separate terminal):
```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

### Access Admin Panel

Navigate to: `http://localhost:5173/admin`

Login with your admin credentials.

## API Endpoints

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories (public)
- `GET /api/categories/:id` - Get single category (public)
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get single order (admin only)
- `POST /api/orders` - Create order (public)
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Statistics
- `GET /api/stats/dashboard` - Get dashboard statistics (admin only)

## Features

### Dashboard
- Total revenue, orders, and products
- Pending orders count
- Recent orders list
- Low stock alerts
- Sales by category

### Product Management
- Add, edit, delete products
- Upload product images
- Set featured products
- Manage stock levels
- Filter by category
- Search functionality

### Order Management
- View all orders
- Filter by status
- Update order status
- View order details
- Customer information
- Order items breakdown

### Category Management
- Add, edit, delete categories
- Inline editing
- Slug management

## Security

- Admin routes are protected with authentication middleware
- JWT token validation
- Role-based access control (admin role required)
- Service role key used for admin operations
- CORS configured for allowed origins

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify `.env` file exists and has correct values
- Run `npm install` to ensure all dependencies are installed

### Authentication errors
- Verify Supabase credentials in `.env`
- Check if user has 'admin' role in `users` table
- Ensure service role key is set (not anon key)

### CORS errors
- Check `CLIENT_URL` in backend `.env`
- Verify frontend is running on the correct port

## Production Deployment

1. Build the backend:
```bash
cd server
npm run build
```

2. Build the frontend:
```bash
cd client
npm run build
```

3. Set production environment variables
4. Deploy backend to your hosting service
5. Deploy frontend build to your hosting service
6. Update CORS settings for production domain

## Future Enhancements

- Image upload to cloud storage
- Advanced analytics and reports
- Bulk product import/export
- Email notifications for orders
- Customer management
- Discount codes and promotions
- Inventory management
- Multi-language support
