const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* 🔑 Supabase Config */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* ---------- API ---------- */

app.get('/api/calendar', async (req, res) => {
  const { data, error } = await supabase
    .from('calendar')
    .select('data')
    .eq('id', 'global')
    .single();

  if (error) return res.status(500).json({});
  res.json(data.data || {});
});

app.post('/api/calendar', async (req, res) => {
  const { error } = await supabase
    .from('calendar')
    .update({ data: req.body })
    .eq('id', 'global');

  if (error) return res.status(500).json({ error });
  res.json({ status: 'ok' });
});

/* ---------- Root ---------- */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server läuft auf', PORT));
