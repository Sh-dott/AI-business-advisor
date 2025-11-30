# Backend API (Future Development)

This directory is reserved for the backend implementation.

## Planned Features

- **Node.js/Express API Server** - RESTful endpoints for AI analysis
- **Database Models** - MongoDB schemas for user data and preferences
- **Authentication** - JWT token-based user authentication
- **Email Service** - Send recommendations via email
- **Analytics** - Track recommendation effectiveness
- **User Profiles** - Store and retrieve user preferences

## Directory Structure

```
backend/
├── models/          # Database schemas
├── routes/          # API endpoints
├── services/        # Business logic
├── middleware/      # Express middleware
├── config/          # Configuration files
├── server.js        # Express app setup
└── README.md        # This file
```

## Future API Endpoints

- `POST /api/analyze` - Submit answers and get recommendations
- `POST /api/users` - Create user account
- `GET /api/recommendations/:id` - Get user recommendations
- `PUT /api/users/:id` - Update user profile
- `POST /api/email` - Send recommendations to email

## Technologies to Use

- Node.js 18+
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer
- Cors & Security

## Getting Started (When Ready)

```bash
npm install express mongoose jsonwebtoken nodemailer cors dotenv
npm install -D nodemon
```

Create `.env` file with:
```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

Run development server:
```bash
npm run dev
```
