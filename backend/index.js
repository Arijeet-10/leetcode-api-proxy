const express = require('express');
const app = express();
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

// Route-specific rate limiter
const specificLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Too many requests for this route, please try again later.'
});

app.use(limiter);
app.use(cors({ origin: '*' }));

// Don't serve static files or index.html
// app.use(express.static('public'));

let leet = require('./leetcode');

// Optional root response
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the LeetCode API proxy!' });
});

// Actual API route
app.get('/:id', specificLimiter, leet.leetcode);

app.listen(3000, () => {
  console.log(`App is running on port 3000`);
});
