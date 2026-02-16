# Admin Dashboard - Order Management System

## Overview
The Admin Dashboard now includes a complete order tracking and analytics system with the following capabilities:

## Features

### 1. **Real-Time Analytics**
- **Weekly, Monthly, Yearly Views**: Switch between time periods to see performance
- **Order Counts**: Track number of completed orders per period
- **Revenue Tracking**: Monitor total money made in each period
- **All-Time Statistics**: View total revenue and order count since inception

### 2. **Customer Management**
- **Customer Database**: Automatically tracks all customers who place orders
- **Customer Profiles**: Shows:
  - Total orders per customer
  - Total amount spent
  - Contact information (name, email, phone)
  - Last order date
- **Customer Order History**: Click the eye icon to view all orders from a specific customer

### 3. **Order Tracking**
- **Recent Orders Panel**: See the 10 most recent orders
- **Order Details**: Each order shows:
  - Unique order number (e.g., ORD-1739654123-AB12C)
  - Customer name
  - Total amount
  - Order status (pending, processing, completed, cancelled)
  - Payment status (unpaid, paid, refunded)
  - Items purchased with quantities

### 4. **Sales Reports**
- **Download Report Button**: Generates a comprehensive JSON report including:
  - Total orders and revenue for the selected period
  - Product-wise breakdown:
    - Total quantity sold per product
    - Revenue generated per product
    - Number of orders containing each product
  - Complete order details
  - Customer information

### 5. **Product Performance**
The system tracks which products are selling best by:
- Counting total units sold
- Calculating revenue per product
- Tracking how many orders include each product

## API Endpoints Created

### Public Endpoints
- `POST /api/orders` - Create a new order (used by the shop page)

### Admin Endpoints (Require Authentication)
- `GET /api/admin/analytics` - Get dashboard analytics (weekly, monthly, yearly, total)
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/customers` - Get all customers sorted by spending
- `GET /api/admin/customers/:email/orders` - Get orders for a specific customer
- `PATCH /api/admin/orders/:id` - Update order status
- `GET /api/admin/reports/sales?startDate=X&endDate=Y` - Generate sales report

## Database Models

### Order Model
```javascript
{
  orderNumber: String (unique),
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  items: [{
    productName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: 'pending' | 'processing' | 'completed' | 'cancelled',
  paymentStatus: 'unpaid' | 'paid' | 'refunded',
  createdAt: Date,
  completedAt: Date
}
```

### Customer Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  totalOrders: Number,
  totalSpent: Number,
  lastOrderDate: Date,
  createdAt: Date
}
```

## How to Use

### For Testing (Creating Sample Orders)
You can create test orders by making a POST request to `/api/orders`:

```javascript
// Example order creation
fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+234-XXX-XXX-XXXX',
    items: [
      { productName: 'Cassava Flour', quantity: 2, price: 5000 },
      { productName: 'Palm Oil', quantity: 1, price: 8000 }
    ],
    totalAmount: 18000
  })
})
```

### Viewing Analytics
1. Log in as an admin
2. Navigate to the Staff Portal
3. Use the period selector (Weekly/Monthly/Yearly) to switch views
4. View real-time statistics on orders and revenue

### Downloading Reports
1. Click the "Download Report" button in the header
2. A JSON file will be downloaded with comprehensive sales data
3. The report includes:
   - Date range
   - Total orders and revenue
   - Product-wise sales breakdown
   - Complete order details

### Viewing Customer Details
1. Scroll to the "Top Customers" section
2. Customers are sorted by total spending
3. Click the eye icon next to any customer to see their order history
4. A modal will open showing all orders from that customer

## Dashboard Sections

### Header
- Period selector buttons
- Download Report button
- Sign Out button

### Stats Cards (Top Row)
1. **Period Orders**: Number of completed orders in selected period
2. **Period Revenue**: Total money made in selected period
3. **Total Customers**: All-time customer count
4. **All-Time Revenue**: Total revenue from all completed orders

### Bottom Panels
1. **Recent Orders**: Last 10 orders with status indicators
2. **Top Customers**: Customers sorted by spending with order counts

## Status Indicators
- **Green (Completed)**: Order successfully fulfilled
- **Orange (Processing)**: Order being prepared
- **Gray (Pending)**: Order awaiting processing
- **Red (Cancelled)**: Order cancelled

## Next Steps for Integration
To fully integrate this with your shop:
1. Connect the shop checkout page to POST to `/api/orders`
2. Add payment gateway integration
3. Set up email notifications for new orders
4. Add order status update functionality in the admin panel
5. Implement inventory tracking based on orders

## Security
- All admin endpoints require JWT authentication
- Only users with 'admin' or 'superadmin' role can access analytics
- Customer data is protected and only accessible to authenticated admins
