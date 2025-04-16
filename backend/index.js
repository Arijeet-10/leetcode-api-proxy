const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Root route to test if server is working
app.get('/', (req, res) => {
  res.send('Welcome to the LeetCode API Proxy!');
});

// Proxy endpoint to get LeetCode user data
app.post('/api/leetcode/user', async (req, res) => {
  const { username } = req.body;

  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            count
            difficulty
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const data = await response.json();

    if (!data.data?.matchedUser) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: data.data.matchedUser.username,
      problemsSolved: data.data.matchedUser.submitStats.acSubmissionNum,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
