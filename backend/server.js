require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { syncDatabase } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/payroll', require('./routes/payroll'));

app.get('/', (req, res) => {
  res.json({
    status: 'PeopleOS Backend API is running',
    health: '/health',
    apiBase: '/api'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'PeopleOS Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const checkExistingBackend = () => new Promise((resolve) => {
  const req = http.get(`http://localhost:${PORT}/health`, (res) => {
    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      resolve(res.statusCode === 200 && body.includes('PeopleOS Backend is running'));
    });
  });

  req.on('error', () => resolve(false));
  req.setTimeout(1000, () => {
    req.destroy();
    resolve(false);
  });
});

const startServer = async () => {
  try {
    const backendAlreadyRunning = await checkExistingBackend();
    if (backendAlreadyRunning) {
      console.log(`PeopleOS Backend is already running on port ${PORT}`);
      return;
    }

    // Sync database
    const dbSynced = await syncDatabase();
    if (!dbSynced) {
      throw new Error('Database synchronization failed');
    }

    const server = app.listen(PORT, () => {
      console.log(`PeopleOS Backend running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing process or set PORT to another value.`);
        process.exit(1);
      }

      throw error;
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
