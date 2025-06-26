require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { 
  extractDomainFromEmail,
  getCompanyName,
  getFavicon
} = require('./utils');
const { submitToHubSpot } = require('./hubspot');

const app = express();

// Basic middleware setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Marketing API of Conveo. Are you allowed to be here?',
    version: '1.0.0'
  });
});

app.get('/api/analyze-email', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const domain = extractDomainFromEmail(email);
    if (!domain) {
      return res.status(400).json({ error: 'Could not extract domain from email' });
    }

    res.json({
      companyName: getCompanyName(domain),
      favicon: getFavicon(domain),
      domain
    });
  } catch (error) {
    console.error('Error analyzing email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/submit-form', async (req, res) => {
  try {
    console.log('Received body:', req.body); // Debug log

    // Extract data from the wrapper if it exists
    const formData = req.body.data || req.body;
    const formContext = req.body.context || {};

    // Validate request body
    if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        details: 'Request body must be a non-empty object with form values'
      });
    }

    const result = await submitToHubSpot(formData, formContext);
    
    res.json({
      success: true,
      message: 'Form submitted successfully',
      result
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    
    if (error.status) {
      return res.status(error.status).json({
        error: error.message,
        details: error.errors
      });
    }

    res.status(500).json({
      error: 'Error submitting form to HubSpot',
      message: error.message
    });
  }
});

// Error handling middleware should be last
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Handle body-parser errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      error: 'Invalid JSON format',
      details: err.message
    });
  }

  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler should be after all routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app; 