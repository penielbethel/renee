# Product Management System - Setup Guide

## 🎉 New Features Implemented

### Admin Dashboard
- **Edit Product Prices** - Click "Edit Price" on any product card
- **Real-time Updates** - Changes reflect immediately on the Shop page
- **Database-Driven** - All products are now stored in MongoDB

### Shop Page
- **Dynamic Pricing** - Prices update automatically when admin makes changes
- **Database Integration** - Products fetched from database on page load

## 🚀 Initial Setup (One-Time Only)

To initialize the products in the database, you need to make a POST request to the initialization endpoint.

### Option 1: Using Browser Console (Easiest)

1. **Login as Admin** at http://localhost:5173/login
2. **Open Browser Console** (F12 or Right-click → Inspect → Console)
3. **Paste and run this code**:

```javascript
const token = localStorage.getItem('renee_token');
fetch('http://localhost:5000/api/admin/products/initialize', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('✅ Products initialized:', data))
.catch(err => console.error('❌ Error:', err));
```

### Option 2: Using PowerShell

```powershell
# First, login and get your token
# Then run:
$token = "YOUR_TOKEN_HERE"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/products/initialize" -Method POST -Headers $headers
```

### Option 3: Using Postman or Thunder Client

1. **Method**: POST
2. **URL**: `http://localhost:5000/api/admin/products/initialize`
3. **Headers**: 
   - `Authorization`: `Bearer YOUR_TOKEN`
   - `Content-Type`: `application/json`
4. **Send Request**

## 📝 How to Use

### Editing Product Prices

1. **Go to Admin Dashboard** (http://localhost:5173/admin-dashboard)
2. **Scroll to Product Inventory** section
3. **Click to expand** the collapsible section
4. **Click "Edit Price"** on any product
5. **Enter new price** in the modal
6. **Click "Save Changes"**
7. **Done!** The price updates immediately in the database

### Viewing Updated Prices

1. **Go to Shop Page** (http://localhost:5173/shop)
2. **Refresh the page** to see updated prices
3. Prices are fetched fresh from the database on every page load

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products (used by Shop page)

### Admin Endpoints (Require Authentication)
- `POST /api/admin/products/initialize` - Initialize products (one-time)
- `PATCH /api/admin/products/:id` - Update product details

## 📊 Database Schema

Products are stored with the following structure:
```javascript
{
  id: String (unique),
  name: String,
  category: String,
  tagline: String,
  size: String,
  description: String,
  price: Number,
  image: String,
  rating: Number,
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## ✅ Testing the System

1. **Initialize products** (one-time setup)
2. **Login as admin** and go to dashboard
3. **Edit a product price** (e.g., change Kulikuli Small Pack from ₦500 to ₦600)
4. **Open Shop page** in a new tab
5. **Verify the price** has changed to ₦600
6. **Success!** 🎉

## 🎨 Features

- ✅ Collapsible Product Inventory section
- ✅ Beautiful Edit Price modal
- ✅ Real-time price updates
- ✅ Database persistence
- ✅ Loading states
- ✅ Error handling
- ✅ Smooth animations

## 🔐 Security

- Only authenticated admins can edit prices
- Token-based authentication required
- Input validation on price updates
- Protected API endpoints

---

**Note**: Make sure MongoDB is running and the server is started before using these features!
