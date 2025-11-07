# MealConnect Backend

Full-stack MERN implementation for food donation and pickup management.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Frontend**: React (see `../food-delivery-app`)

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 2. Environment Variables
Create a `.env` file in the `backend/` directory with the following:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/mealconnect
MONGO_DB=mealconnect
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Seed Database
This will create sample data (users, restaurants, menu items):
```bash
npm run seed
```

**Sample Login Credentials:**
- Admin: `admin@mealconnect.com` / `admin123`
- Restaurant: `restaurant1@mealconnect.com` / `rest123`
- NGO: `ngo@mealconnect.com` / `ngo123`
- User: `user@mealconnect.com` / `user123`

### 5. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `POST /api/restaurants` - Create restaurant (protected)
- `GET /api/restaurants/my-restaurant` - Get user's restaurant (protected)
- `PUT /api/restaurants/my-restaurant` - Update user's restaurant (protected)

### Menu Items
- `GET /api/menu-items` - List all available menu items
- `GET /api/menu-items/restaurant/:restaurantId` - Get items by restaurant
- `GET /api/menu-items/my-items` - Get user's menu items (protected)
- `POST /api/menu-items` - Create menu item (protected, supports file upload)
- `PUT /api/menu-items/:id` - Update menu item (protected)
- `DELETE /api/menu-items/:id` - Delete menu item (protected)

### Pickup Requests
- `GET /api/pickups` - List all pickup requests
- `GET /api/pickups/my-orders` - Get user's orders (protected)
- `GET /api/pickups/my-restaurant` - Get restaurant's pickup requests (protected)
- `GET /api/pickups/:id` - Get pickup by ID (protected)
- `POST /api/pickups` - Create pickup request (protected)
- `PUT /api/pickups/:id/status` - Update pickup status (protected)
- `PUT /api/pickups/:id/cancel` - Cancel pickup request (protected)

### Volunteers
- `GET /api/volunteers` - List volunteer applications
- `POST /api/volunteers` - Submit volunteer application (supports file upload)

### Health Check
- `GET /api/health` - Server health check

## User Roles
- **user**: Regular user, can browse and order food
- **restaurant**: Restaurant owner, can manage menu items and pickup requests
- **ngo**: NGO representative, can browse and order food
- **admin**: Admin user with full access

## File Uploads
- Menu item images: Uploaded to `backend/uploads/menu-items/`
- Volunteer proofs: Uploaded to `backend/uploads/`

## Database Models
- **User**: Authentication and user profiles
- **Restaurant**: Restaurant information
- **MenuItem**: Food items with expiry times
- **PickupRequest**: Orders and pickup requests
- **VolunteerApplication**: Volunteer applications

## Error Handling
All errors return JSON in the format:
```json
{
  "message": "Error message here"
}
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- File upload validation
- Input validation and sanitization

