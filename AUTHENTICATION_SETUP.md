# 🔐 Authentication & User-Specific Tasks Implementation

## Overview
This update implements user authentication and authorization for all task operations. Each user now has their own isolated task list with complete security.

---

## 📋 What Changed?

### Backend Changes

#### 1. **New Authentication Middleware** (`backend/middleware/authMiddleware.js`)
- Validates JWT tokens on every request
- Extracts user information from token
- Attaches `req.user` to the request object
- Returns 401 errors for invalid/expired tokens

#### 2. **Updated Task Model** (`backend/models/Task.js`)
- Added `userId` field (required, references User model)
- Created database indexes for efficient querying:
  - `userId + status` for filtering by status
  - `userId + dueDate` for date-based queries

#### 3. **Secured Task Routes** (`backend/routes/taskRoutes.js`)
- Applied authentication middleware to ALL routes
- **CREATE**: Automatically assigns `userId` from authenticated user
- **GET**: Returns only tasks belonging to the authenticated user
- **UPDATE**: Verifies ownership before allowing updates, prevents userId modification
- **DELETE**: Verifies ownership before allowing deletion

#### 4. **Environment Configuration** (`backend/.env.example`)
- Documented all required environment variables
- Added examples for MongoDB connection strings
- Specified JWT secret requirements

### Frontend Changes

#### 1. **New API Configuration** (`frontend/src/config/api.js`)
- Created centralized axios instance with automatic token injection
- **Request Interceptor**: Adds JWT token to Authorization header for every request
- **Response Interceptor**: Handles 401 errors and redirects to login
- Prevents duplicate code across components

#### 2. **Updated All Components & Pages**
- Replaced direct axios calls with the new `api` instance
- Removed manual `VITE_API_URL` concatenation (now handled by baseURL)
- All API calls now automatically include authentication

#### 3. **Environment Configuration** (`frontend/.env.example`)
- Documented VITE_API_URL for local and production environments

---

## 🔒 Security Features

### 1. **User Isolation**
- Users can ONLY see their own tasks
- Users CANNOT access, modify, or delete other users' tasks
- Database queries automatically filter by userId

### 2. **Token-Based Authentication**
- JWT tokens contain user ID and name
- Tokens expire after 24 hours (configurable in authRoutes.js)
- Invalid/expired tokens automatically redirect to login

### 3. **Ownership Verification**
- Every UPDATE and DELETE operation verifies task ownership
- Returns 404 if task doesn't exist OR user doesn't own it
- Prevents userId from being modified in updates

### 4. **Automatic Token Handling**
- Frontend automatically adds token to all requests
- No manual header configuration needed
- Centralized error handling for auth failures

---

## 🚀 Setup Instructions

### Backend Setup

1. **Create environment file**:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configure environment variables** in `backend/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/taskprogresser
   JWT_SECRET=your_super_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Create environment file**:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Configure environment variables** in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## ⚠️ Important Notes

### Database Migration
**CRITICAL**: Existing tasks in your database will fail to load because they don't have a `userId` field!

**Solution Options**:

1. **Option 1: Fresh Start (Recommended for Development)**
   - Drop the tasks collection:
     ```javascript
     // In MongoDB shell or Compass
     db.tasks.drop()
     ```

2. **Option 2: Migrate Existing Tasks**
   - Assign all existing tasks to a specific user:
     ```javascript
     // Replace 'USER_ID_HERE' with actual user's _id
     db.tasks.updateMany(
       { userId: { $exists: false } },
       { $set: { userId: ObjectId('USER_ID_HERE') } }
     )
     ```

### Testing the Changes

1. **Sign up a new user** at `/signup`
2. **Login** with your credentials
3. **Create tasks** - they will be associated with your user ID
4. **Log out and create another account** - you won't see the first user's tasks
5. **Try accessing tasks via API without token** - should return 401 error

### API Endpoint Changes

**Before**: Tasks were global
```javascript
GET /api/tasks → Returns ALL tasks from ALL users
```

**After**: Tasks are user-specific
```javascript
GET /api/tasks
Headers: { Authorization: 'Bearer <token>' }
→ Returns only YOUR tasks
```

---

## 🔍 How It Works

### Request Flow

1. **User logs in** → Server generates JWT token with user ID
2. **Token stored** in localStorage
3. **User makes request** (e.g., fetch tasks)
4. **API interceptor** automatically adds token to request headers
5. **Auth middleware** verifies token and extracts user ID
6. **Route handler** uses `req.user.id` to filter/create user-specific data
7. **Response** contains only data belonging to that user

### Example: Creating a Task

**Frontend**:
```javascript
await api.post('/api/tasks', {
  title: 'My Task',
  description: 'Task details'
});
```

**Backend Flow**:
1. Request intercepted by `authMiddleware`
2. Token validated, `req.user.id` set
3. Route handler adds `userId` to task data
4. Task saved with userId: `{ title, description, userId: req.user.id }`

---

## 🐛 Troubleshooting

### "Access denied. No token provided"
- Make sure you're logged in
- Check if token exists in localStorage
- Token might have expired (24 hour expiry)

### "Task not found or you don't have permission"
- Trying to update/delete someone else's task
- Task ID might be invalid
- User doesn't own that task

### "Cannot connect to server"
- Check if backend is running on correct port
- Verify VITE_API_URL in frontend/.env
- Check CORS configuration in backend/server.js

### Tasks not showing up after update
- Old tasks in database don't have userId
- See "Database Migration" section above
- Create new tasks after implementing changes

---

## 📊 Benefits of This Implementation

✅ **Security**: Users can only access their own data  
✅ **Multi-tenancy**: Multiple users can use the app independently  
✅ **Privacy**: Complete data isolation between users  
✅ **Scalability**: Ready for production deployment  
✅ **Best Practices**: Industry-standard JWT authentication  
✅ **User Experience**: Automatic token handling, seamless auth  
✅ **Performance**: Database indexes for fast queries  

---

## 🎯 Next Steps (Optional Improvements)

1. Add refresh tokens for extended sessions
2. Implement password reset functionality
3. Add email verification
4. Rate limiting for API endpoints
5. Implement role-based access control (admin/user)
6. Add task sharing between users
7. Implement httpOnly cookies instead of localStorage

---

## 📝 Summary

This implementation transforms your task manager from a single-user demo into a production-ready multi-user application with proper authentication, authorization, and data isolation. Every task is now securely tied to a user, and all operations are protected by JWT authentication.
