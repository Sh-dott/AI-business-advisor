# API Documentation (Future)

This document describes the API endpoints that will be implemented in the backend.

## Current Status

The application currently runs entirely on the frontend with no backend API. All analysis is performed client-side.

## Planned Backend API (v1.1.0+)

### Base URL
```
http://localhost:5000/api
or
https://api.businessadvisor.com/api
```

## Endpoints

### 1. POST /analyze

Analyze business answers and get recommendations.

**Request:**
```json
{
  "answers": {
    "business": "retail",
    "challenge": "customers",
    "budget": "medium",
    "team_size": "small",
    "tech_level": "intermediate",
    "description": "E-commerce store with 3 employees..."
  },
  "userId": "optional_user_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "recommendations": [
    {
      "name": "Shopify",
      "category": "E-commerce",
      "priority": "Critical",
      "score": 95,
      "pricing": "116 ש"ח/חודש",
      "setup": "1-2 ימים",
      "complexity": "נמוכה",
      "description": "...",
      "factors": [...],
      "steps": [...],
      "link": "https://shopify.com"
    },
    ...
  ],
  "timestamp": "2025-11-30T10:30:00Z"
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Invalid answers format",
  "details": "Missing required field: business"
}
```

---

### 2. POST /users

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "businessName": "My Awesome Store",
  "businessType": "retail"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "businessName": "My Awesome Store",
    "createdAt": "2025-11-30T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### 3. GET /users/:userId

Get user profile information.

**Request:**
```
GET /users/user_123
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "businessName": "My Awesome Store",
    "businessType": "retail",
    "createdAt": "2025-11-30T10:30:00Z",
    "lastAnalysis": "2025-11-30T12:00:00Z"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Unauthorized - Invalid token"
}
```

---

### 4. PUT /users/:userId

Update user profile.

**Request:**
```json
{
  "businessName": "Updated Business Name",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "newemail@example.com",
    "businessName": "Updated Business Name"
  }
}
```

---

### 5. GET /users/:userId/recommendations

Get user's recommendation history.

**Request:**
```
GET /users/user_123/recommendations?limit=10&skip=0
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "rec_123",
      "timestamp": "2025-11-30T12:00:00Z",
      "recommendations": [...],
      "score": 85
    },
    ...
  ],
  "total": 5,
  "limit": 10,
  "skip": 0
}
```

---

### 6. POST /email

Send recommendations via email.

**Request:**
```json
{
  "email": "user@example.com",
  "recommendationId": "rec_123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "msg_456"
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

---

### 7. POST /auth/login

User login.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "businessName": "My Business"
  }
}
```

---

### 8. POST /auth/refresh

Refresh authentication token.

**Request:**
```json
{
  "token": "expired_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "new_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 9. POST /auth/logout

User logout.

**Request:**
```
POST /auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 10. GET /technologies

Get all available technologies.

**Request:**
```
GET /technologies?category=CRM&budget=low
```

**Response (200):**
```json
{
  "success": true,
  "technologies": [
    {
      "id": "hubspot_free",
      "name": "HubSpot CRM Free",
      "category": "CRM & Customer Management",
      ...
    },
    ...
  ],
  "total": 150
}
```

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration
- Access Token: 1 hour
- Refresh Token: 30 days

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional context",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `INVALID_PARAMS` - Invalid request parameters
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Authenticated but not authorized
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Rate Limited
- `500` - Server Error

---

## Rate Limiting

API endpoints are rate limited:
- **Unauthenticated**: 10 requests per minute per IP
- **Authenticated**: 100 requests per minute per user
- **Premium**: 1000 requests per minute per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701343800
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `limit` - Number of results (default: 20, max: 100)
- `skip` - Number of results to skip (default: 0)
- `sort` - Sort field (default: -createdAt)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 245,
  "limit": 20,
  "skip": 0,
  "pages": 13
}
```

---

## Example Usage

### JavaScript/Fetch

```javascript
// Create user
const response = await fetch('http://localhost:5000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'secure_password',
    businessName: 'My Store'
  })
});

const data = await response.json();
const token = data.user.token;

// Get recommendations
const recResponse = await fetch('http://localhost:5000/api/users/user_123/recommendations', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const recommendations = await recResponse.json();
```

### cURL

```bash
# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password",
    "businessName": "My Store"
  }'

# Get user recommendations
curl -X GET http://localhost:5000/api/users/user_123/recommendations \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## Changelog

### Version 1.1.0 (Planned)
- Initial backend release
- User authentication
- Recommendation analysis API
- Email delivery

### Version 1.2.0 (Planned)
- User profile management
- Recommendation history
- Advanced filtering
- Export to CSV/PDF

### Version 2.0.0 (Planned)
- Cloud AI analysis integration
- Real-time notifications
- Team collaboration
- Advanced analytics
