// TODO: Add database connection
// const pool = require('../../db');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guideId, content } = req.body;

  if (!guideId || !content) {
    return res.status(400).json({ error: 'Guide ID and content are required' });
  }

  // TODO: Replace with actual database query
  // const [result] = await pool.query(
  //   'INSERT INTO messages (guide_id, sender, content) VALUES (?, ?, ?)',
  //   [guideId, 'admin', content]
  // );

  // Dummy response for testing
  const newMessage = {
    id: Math.floor(Math.random() * 1000),
    sender: 'admin',
    content,
    timestamp: new Date().toISOString(),
    guide_id: guideId
  };

  // Simulate API delay
  setTimeout(() => {
    res.status(200).json({ message: newMessage });
  }, 500);
} 