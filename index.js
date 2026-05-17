const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'notifications.json');

app.use(cors());
app.use(express.json());

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// POST - Add a notification
app.post('/api/notifications', (req, res) => {
  const { message, type } = req.body;

  // Validate fields
  if (!message || !type) {
    return res.status(400).json({ error: "Missing required fields: message and type are required." });
  }

  const validTypes = ["success", "error", "warning", "info"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(", ")}` });
  }

  const data = readData();
  const newNotification = {
    id: Date.now(),
    message,
    type,
    timestamp: new Date().toISOString()
  };

  // Add to front so most recent is first
  data.notifications.unshift(newNotification); 
  writeData(data);
  res.status(200).json(newNotification);
});

// GET - Retrieve all notifications
app.get('/api/notifications', (req, res) => {
  const data = readData();
  res.status(200).json(data.notifications);
});

// DELETE - Clear all notifications
app.delete('/api/notifications', (req, res) => {
  const data = readData();
  data.notifications = [];
  writeData(data);
  res.status(200).json({ success: true, message: "All notifications cleared" });
});

if (require.main === module) {
  app.listen(3002, () => console.log('Notification service running on port 3002'));
}

module.exports = app;