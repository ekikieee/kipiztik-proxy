const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api', async (req, res) => {
  const { url, hd } = req.query;
  if (!url) return res.status(400).json({ error: 'url required' });
  try {
    const r = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=${hd || 1}`
    );
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'upstream failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`proxy :${PORT}`));
