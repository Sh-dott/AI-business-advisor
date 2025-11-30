// Express Server Setup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const config = require('./config/environment');
const { errorHandler } = require('./middleware/error-handler');

// Import routes
const authRoutes = require('./routes/auth');
const analyzeRoutes = require('./routes/analyze');
const exportRoutes = require('./routes/export');

// Initialize app
const app = express();

// Connect to database
connectDB();

// ===== MIDDLEWARE =====

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Analysis routes
app.use('/api/analyze', analyzeRoutes);

// Export routes (document generation)
app.use('/api/export', exportRoutes);

// Analytics routes (placeholder)
app.get('/api/health/status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    uptime: process.uptime(),
    database: 'connected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// ===== ERROR HANDLING =====
app.use(errorHandler);

// ===== START SERVER =====
const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════╗`);
  console.log(`║  AI Business Advisor Backend                ║`);
  console.log(`║  Server running on port ${PORT}                  ║`);
  console.log(`║  Environment: ${config.NODE_ENV.padEnd(25)}║`);
  console.log(`║  Frontend: ${config.FRONTEND_URL.padEnd(27)}║`);
  console.log(`╚════════════════════════════════════════════╝\n`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
