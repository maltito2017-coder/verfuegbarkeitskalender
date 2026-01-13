const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// === Dateien static serven ===
app.use(express.static(path.join(__dirname)));

// === Data Datei ===
const FILE = 'data.json';
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({}));

// === Root Route: Kalender ausliefern ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === API: Kalenderdaten holen ===
app.get('/api/calendar', (req, res) => {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(FILE));
  } catch (e) {
    console.error('data.json fehlerhaft, wird zurückgesetzt');
    data = {};
    fs.writeFileSync(FILE, JSON.stringify(data));
  }
  res.json(data);
});

// === API: Kalenderdaten speichern ===
app.post('/api/calendar', (req, res) => {
  fs.writeFileSync(FILE, JSON.stringify(req.body, null, 2));
  res.json({ status: 'ok' });
});

// === Render Port (0.0.0.0 für öffentlich erreichbar) ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('Server läuft auf Port', PORT));