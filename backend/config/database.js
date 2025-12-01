// MongoDB connection configuration
const mongoose = require('mongoose');
const config = require('./environment');

const connectDB = async () => {
  // Skip database connection if MONGODB_URI is not configured
  if (!config.MONGODB_URI) {
    console.log('⚠ MongoDB not configured - skipping database connection');
    console.log('  (App uses Word document export instead of database storage)');
    return null;
  }

  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: config.DB_NAME
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.db.name}`);

    return conn;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);

    if (config.NODE_ENV === 'production') {
      // In production, continue without database (we use Word export instead)
      console.warn('⚠ Continuing without database (using Word document export)');
      return null;
    }

    // In development, allow continued operation
    console.warn('⚠ Continuing without database (development mode)');
    return null;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✓ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠ Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('✓ Mongoose disconnected on app termination');
  process.exit(0);
});

module.exports = connectDB;
