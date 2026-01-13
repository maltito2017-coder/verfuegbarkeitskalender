const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const FILE = 'data.json';
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({}));

// Root-Route
app.get('/', (req, res) => {
  res.send('Backend läuft 👍');
});

// API Route
app.get('/api/calendar', (req, res) => {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(FILE));
  } catch (e) {
    console.error('data.json fehlerhaft, wird zurückgesetzt');
    fs.writeFileSync(FILE, JSON.stringify({}));
  }
  res.json(data);
});

app.post('/api/calendar', (req, res) => {
  fs.writeFileSync(FILE, JSON.stringify(req.body, null, 2));
  res.json({ status: 'ok' });
});

// Render Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('Server läuft auf Port', PORT));