# Hostia Backend API Documentation

Complete backend system for Hostia Admin Panel with JWT authentication, user management, order management, categories, and real-time dashboard statistics.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Configure environment**:
The `.env` file is already configured with:
```
JWT_SECRET=dev-secret-key-replace-in-production-123456
ADMIN_EMAIL=vansh@vansh
ADMIN_PASSWORD=vansh
PORT=5000
```

3. **Update existing admin credentials** (if database already exists):
```bash
node update-admin.js
```

4. **Start the server**:
```bash
npm run server
```

The server will run on `http://localhost:5000`

### First Run
On first run, the system will:
- Create SQLite database (`server/hostia.db`)
- Initialize all required tables
- Create default admin user: `vansh@vansh` / `vansh`

---

## 🔐 Authentication

### Admin Login
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "vansh@vansh",
  "password": "vansh"
}
```

**Response:**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "fullName": "Admin",
    "email": "vansh@vansh",
    "role": "admin"
  }
}
```

### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👥 User Management (Admin Only)

All user management endpoints require admin authentication.

### Get All Users
```http
GET /api/users
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "1234567890",
      "discordId": "user#1234",
      "role": "user",
      "createdAt": "2024-12-01T00:00:00.000Z"
    }
  ]
}
```

### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create New User
```http
POST /api/users
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phoneNumber": "9876543210",
  "discordId": "jane#5678",
  "password": "securepass123",
  "role": "user"
}
```

**Note:** `role` can be "user" or "admin". Defaults to "user" if not specified.

### Update User Details
```http
PUT /api/users/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "email": "janesmith@example.com",
  "phoneNumber": "1111111111",
  "discordId": "newjane#9999",
  "password": "newpassword123"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

### Update User Role
```http
PUT /api/users/:id/role
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "role": "admin"
}
```

**Note:** System prevents removing the last admin user.

### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Note:** 
- Cannot delete user with existing orders
- Cannot delete the last admin user

---

## 📦 Order Management

### Create Order
```http
POST /api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "planId": 1,
  "promoCode": "DISCOUNT20"
}
```

### Get All Orders (Admin)
```http
GET /api/orders/admin/all
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get User Orders
```http
GET /api/orders/user/:userId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Approve Order (Admin)
```http
PUT /api/orders/:id/verify
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "vpsDetails": {
    "ip": "192.168.1.1",
    "username": "root",
    "password": "secure123"
  },
  "renewalDate": "2025-12-01"
}
```

### Reject Order (Admin)
```http
PUT /api/orders/:id/reject
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "reason": "Invalid payment screenshot"
}
```

### Delete Order
```http
DELETE /api/orders/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Active Orders (Manager View)
```http
GET /api/orders/manager/active
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Expired Orders (Manager View)
```http
GET /api/orders/manager/expired
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📊 Dashboard Analytics (Admin Only)

### Get Dashboard Statistics
```http
GET /api/analytics/dashboard
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "orderStats": {
    "totalRevenue": 15000,
    "totalSales": 50,
    "activeOrders": 20,
    "pendingPayments": 5,
    "serviceTypeCounts": [
      { "type": "vps", "count": 15 },
      { "type": "bot", "count": 5 }
    ]
  },
  "userStats": {
    "totalUsers": 42
  },
  "recentOrders": [
    {
      "id": 1,
      "userName": "John Doe",
      "planName": "VPS Pro",
      "finalPrice": 1499,
      "status": "active",
      "createdAt": "2024-12-01T00:00:00.000Z"
    }
  ]
}
```

**Statistics Details:**
- **totalRevenue**: Sum of all completed and active orders
- **activeOrders**: Count of orders with status "active"
- **pendingPayments**: Count of orders with status "pending_upload" or "payment_uploaded"
- **totalUsers**: Count of users with role "user"
- **recentOrders**: Last 5 orders with customer and plan details

---

## 🏷️ Categories Management (Admin Only)

### Get All Categories
```http
GET /api/categories?type=vps
```

**Query Parameters:**
- `type` (optional): Filter by category type (e.g., "vps", "bot")

### Get All Categories (Admin - includes inactive)
```http
GET /api/categories/admin/all
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Category
```http
POST /api/categories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "AMD Ryzen 9 5950X",
  "type": "vps",
  "displayOrder": 1
}
```

### Update Category
```http
PUT /api/categories/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Intel Platinum 8280",
  "type": "vps",
  "isActive": 1,
  "displayOrder": 2
}
```

### Delete Category
```http
DELETE /api/categories/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Note:** Cannot delete category if plans are using it.

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phoneNumber TEXT NOT NULL,
  discordId TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  planId INTEGER NOT NULL,
  originalPrice REAL NOT NULL,
  discountAmount REAL DEFAULT 0,
  finalPrice REAL NOT NULL,
  promoCode TEXT,
  items TEXT,
  paymentScreenshot TEXT,
  transactionId TEXT,
  status TEXT DEFAULT 'pending_upload',
  rejectionReason TEXT,
  vpsDetails TEXT,
  renewalDate DATE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (planId) REFERENCES plans(id)
)
```

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  isActive INTEGER DEFAULT 1,
  displayOrder INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds of 10
- **Role-Based Access Control**: Admin-only routes protected
- **Token Expiration**: 7 days default expiration
- **Input Validation**: All inputs validated before processing
- **SQL Injection Protection**: Parameterized queries throughout

---

## 🧪 Testing

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vansh@vansh","password":"vansh"}'
```

### Test Get Dashboard Stats (replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Order Status Flow

1. **pending_upload** → User created order, needs to upload payment
2. **payment_uploaded** → User uploaded payment screenshot
3. **active** → Admin verified payment and activated service
4. **rejected** → Admin rejected the payment
5. **completed** → Service period completed
6. **expired** → Service expired (renewal date passed)

---

## 🎯 Integration with Frontend

The frontend should:

1. **Store JWT token** after login (localStorage/sessionStorage)
2. **Include token** in all API requests:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```
3. **Handle token expiration** (401/403 responses)
4. **Redirect to login** if unauthorized

### Example Frontend API Client
```javascript
const API_BASE = 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    throw new Error(await response.text());
  }
  
  return response.json();
}

// Login
const { token, user } = await apiRequest('/auth/admin/login', {
  method: 'POST',
  body: JSON.stringify({ email: 'vansh@vansh', password: 'vansh' })
});
localStorage.setItem('authToken', token);

// Get dashboard stats
const stats = await apiRequest('/analytics/dashboard');
```

---

## ⚡ Running Full Stack

To run both frontend and backend together:

```bash
npm run dev:full
```

This runs:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:5000`

---

## 🔧 Troubleshooting

### Database Issues
If you encounter database errors:
```bash
# Delete and recreate database
rm server/hostia.db
npm run server
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### Admin Login Not Working
```bash
# Update admin credentials
node update-admin.js
```

---

## 📚 Additional Notes

- All timestamps are in UTC
- File uploads stored in `server/uploads/`
- Database file: `server/hostia.db`
- CORS enabled for all origins (configure for production)
- Default JWT secret should be changed in production

---

**Backend Status:** ✅ Fully Functional

Ready for integration with the existing frontend admin panel!
