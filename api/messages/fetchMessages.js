// TODO: Add database connection
// const pool = require('../../db');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guideId } = req.query;

  if (!guideId) {
    return res.status(400).json({ error: 'Guide ID is required' });
  }

  // TODO: Replace with actual database query
  // const [messages] = await pool.query(
  //   'SELECT * FROM messages WHERE guide_id = ? ORDER BY timestamp ASC',
  //   [guideId]
  // );

  // Dummy data for testing
  const messages = [
    {
      id: 1,
      sender: 'admin',
      content: 'Hello Guide!',
      timestamp: '2024-04-06 10:30',
      guide_id: guideId
    },
    {
      id: 2,
      sender: 'guide',
      content: 'Hi Admin!',
      timestamp: '2024-04-06 10:32',
      guide_id: guideId
    },
    {
      id: 3,
      sender: 'admin',
      content: 'How are you today?',
      timestamp: '2024-04-06 10:33',
      guide_id: guideId
    },
    {
      id: 4,
      sender: 'guide',
      content: 'I\'m doing well, thank you!',
      timestamp: '2024-04-06 10:35',
      guide_id: guideId
    }
  ];

  // Simulate API delay
  setTimeout(() => {
    res.status(200).json({ messages });
  }, 500);
} 